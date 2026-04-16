import { jest } from "@jest/globals";

const mockDb = {
	collection: jest.fn().mockReturnThis(),
	doc: jest.fn().mockReturnValue({ id: "mocked-id" }),
};

const mockQueue = {
	add: jest.fn(),
};

jest.mock("../../../../infra/firestore", () => ({
	db: mockDb,
}));

jest.mock("../../../../infra/queue/shopping-list.queue", () => ({
	shoppingListQueue: mockQueue,
	SHOPPING_LIST_JOBS: {
		CREATE_LIST: "CREATE_LIST",
	},
}));

import { CreateListUseCase } from "../../usecases/create-list.usecase";

describe("CreateListUseCase", () => {
	it("should create a list locally and enqueue it", async () => {
		const useCase = new CreateListUseCase();
		const data = {
			title: "Plan Test",
			category: "Test",
			variant: "primary" as const,
			userId: "user-1",
			items: [
				{
					name: "Item 1",
					price: 5,
					category: "Test",
					marketName: "Test Market",
					quantity: 1,
					unit: "un",
					checked: false,
				} as any,
			],
		};

		const result = await useCase.execute(data);

		expect(result.id).toBe("mocked-id");
		expect(result.ownerId).toBe("user-1");
		expect(result.items[0].listId).toBe("mocked-id");

		expect(mockQueue.add).toHaveBeenCalledWith(
			"CREATE_LIST",
			expect.objectContaining({
				id: "mocked-id",
				title: "Plan Test",
			}),
		);
	});

	it("should handle list without items", async () => {
		const useCase = new CreateListUseCase();
		const data = {
			title: "Empty List",
			category: "Test",
			variant: "secondary" as const,
			userId: "user-2",
		};

		const result = await useCase.execute(data);

		expect(result.items).toEqual([]);
		expect(mockQueue.add).toHaveBeenCalled();
	});
});
