import type { Job } from "bullmq";
import * as admin from "firebase-admin";
import { invalidateCacheByPattern } from "../../cache/redis.helper";
import { db } from "../../firestore";
import { bulkInsertProcessor } from "../bulk-insert.worker";

jest.mock("firebase-admin", () => {
	const mockFirestore = jest.fn(() => ({
		collection: jest.fn().mockReturnThis(),
		doc: jest.fn().mockReturnThis(),
		batch: jest.fn(),
	}));

	// @ts-expect-error
	mockFirestore.FieldValue = {
		increment: jest.fn((val) => `increment(${val})`),
	};

	return {
		apps: [],
		initializeApp: jest.fn(),
		credential: {
			cert: jest.fn(),
		},
		auth: jest.fn(() => ({})),
		firestore: mockFirestore,
	};
});

jest.mock("../../firestore", () => ({
	db: {
		collection: jest.fn().mockReturnThis(),
		doc: jest.fn().mockReturnThis(),
		batch: jest.fn(),
	},
}));

jest.mock("../../cache/redis.helper");
jest.mock("../../logger/logger");

describe("Bulk Insert Worker", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should insert items in batches and update list metadata", async () => {
		const listId = "list-123";
		const items = Array.from({ length: 10 }, (_, i) => ({
			id: `p-${i}`,
			name: `Prod ${i}`,
		}));

		const mockBatch = {
			set: jest.fn(),
			commit: jest.fn().mockResolvedValue([]),
		};

		const mockUpdate = jest.fn().mockResolvedValue([]);

		(db.batch as jest.Mock).mockReturnValue(mockBatch);
		(db.collection as jest.Mock).mockReturnValue({
			doc: jest.fn().mockReturnThis(),
			update: mockUpdate,
			collection: jest.fn().mockReturnThis(),
		});

		const mockJob = {
			id: "job-bulk",
			data: { listId, items },
		} as Job;

		await bulkInsertProcessor(mockJob);

		// Batch insertions
		expect(db.batch).toHaveBeenCalled();
		expect(mockBatch.set).toHaveBeenCalledTimes(items.length);
		expect(mockBatch.commit).toHaveBeenCalled();

		// Parent list update
		expect(mockUpdate).toHaveBeenCalledWith(
			expect.objectContaining({
				totalItems: `increment(${items.length})`,
			}),
		);

		// Cache invalidation
		expect(invalidateCacheByPattern).toHaveBeenCalledWith(
			`products:page:*:list:${listId}`,
		);
		expect(invalidateCacheByPattern).toHaveBeenCalledWith(
			`list:detail:${listId}:*`,
		);
		expect(invalidateCacheByPattern).toHaveBeenCalledWith(
			`list:shared:${listId}`,
		);
	});

	it("should handle large quantities of items by chunking buffers", async () => {
		const listId = "list-large";
		// 600 items should trigger 2 chunks (CHUNK_SIZE = 500)
		const items = Array.from({ length: 600 }, (_, i) => ({
			id: `p-${i}`,
			name: `Prod ${i}`,
		}));

		const mockBatch = {
			set: jest.fn(),
			commit: jest.fn().mockResolvedValue([]),
		};

		(db.batch as jest.Mock).mockReturnValue(mockBatch);

		const mockJob = {
			id: "job-bulk-large",
			data: { listId, items },
		} as Job;

		await bulkInsertProcessor(mockJob);

		expect(db.batch).toHaveBeenCalledTimes(2);
		expect(mockBatch.commit).toHaveBeenCalledTimes(2);
	});
});
