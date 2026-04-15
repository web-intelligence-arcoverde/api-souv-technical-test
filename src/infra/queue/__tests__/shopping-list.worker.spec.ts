import { jest } from "@jest/globals";
import type { Job } from "bullmq";
import * as admin from "firebase-admin";
import { ProductRepository } from "../../../modules/product/repositories/product-repository";
import { ShoppingListRepository } from "../../../modules/shopping-list/repositories/shopping-list.repository";
import { invalidateCacheByPattern } from "../../cache/redis.helper";
import { SHOPPING_LIST_JOBS } from "../shopping-list.queue";
import { shoppingListProcessor } from "../shopping-list.worker";

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

jest.mock("../../../modules/product/repositories/product-repository");
jest.mock(
	"../../../modules/shopping-list/repositories/shopping-list.repository",
);
jest.mock("../../cache/redis.helper");
jest.mock("../../logger/logger");

describe("Shopping List Worker", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("CREATE_LIST", () => {
		it("should create a shopping list and invalidate user cache", async () => {
			const jobData = {
				id: "list-123",
				title: "My List",
				userId: "user-456",
				category: "grocery",
				variant: "standard",
			};

			const mockJob = {
				id: "job-1",
				name: SHOPPING_LIST_JOBS.CREATE_LIST,
				data: jobData,
			} as Job;

			// Mock resolving properly on the prototype to catch the instance inside the worker
			jest
				.mocked(ShoppingListRepository.prototype.create)
				.mockResolvedValue({} as any);

			await shoppingListProcessor(mockJob);

			expect(ShoppingListRepository.prototype.create).toHaveBeenCalledWith(
				expect.objectContaining({
					id: jobData.id,
					title: jobData.title,
					ownerId: jobData.userId,
				}),
			);

			expect(invalidateCacheByPattern).toHaveBeenCalledWith(
				`lists:user:${jobData.userId}:*`,
			);
		});
	});

	describe("ADD_PRODUCT", () => {
		it("should add a product and update list metadata", async () => {
			const listId = "list-123";
			const productData = { id: "prod-1", name: "Apple", price: 1.5 };

			const mockJob = {
				id: "job-2",
				name: SHOPPING_LIST_JOBS.ADD_PRODUCT,
				data: { listId, productData },
			} as Job;

			// Mock resolving properly on prototype
			jest
				.mocked(ProductRepository.prototype.create)
				.mockResolvedValue({} as any);
			jest
				.mocked(ShoppingListRepository.prototype.update)
				.mockResolvedValue({} as any);

			await shoppingListProcessor(mockJob);

			expect(ProductRepository.prototype.create).toHaveBeenCalledWith(
				productData,
			);
			expect(ShoppingListRepository.prototype.update).toHaveBeenCalledWith(
				listId,
				expect.objectContaining({
					totalItems: "increment(1)",
				}),
			);

			expect(invalidateCacheByPattern).toHaveBeenCalledWith(
				`list:detail:${listId}:*`,
			);
			expect(invalidateCacheByPattern).toHaveBeenCalledWith(
				`list:shared:${listId}`,
			);
		});
	});

	it("should throw error if processing fails", async () => {
		const mockJob = {
			id: "job-err",
			name: SHOPPING_LIST_JOBS.CREATE_LIST,
			data: {},
		} as Job;

		// Force error on the prototype method
		jest
			.mocked(ShoppingListRepository.prototype.create)
			.mockRejectedValue(new Error("DB Error"));

		await expect(shoppingListProcessor(mockJob)).rejects.toThrow("DB Error");
	});
});
