import { jest } from "@jest/globals";
import { UpdateListUseCase } from "../../usecases/update-list.usecase";
import {
	createMockRepository,
	createMockShoppingList,
} from "../helpers/shopping-list.test.helper";

const mockInvalidateCache = jest.fn();

jest.mock("../../../../infra/cache/redis.helper", () => ({
	invalidateCacheByPattern: (pattern: string) => mockInvalidateCache(pattern),
}));

describe("UpdateListUseCase", () => {
	beforeEach(() => {
		mockInvalidateCache.mockClear();
	});

	it("should update list and invalidate cache when list exists", async () => {
		const mockRepository = createMockRepository();
		const mockList = createMockShoppingList({ id: "list-1" });
		mockRepository.findById.mockResolvedValue(mockList);
		mockRepository.update.mockResolvedValue(undefined);

		const useCase = new UpdateListUseCase(mockRepository);
		const updateData = { title: "New Title", shared: true };
		await useCase.execute("list-1", updateData);

		expect(mockRepository.update).toHaveBeenCalledWith(
			"list-1",
			expect.objectContaining({
				title: "New Title",
				shared: true,
				lastModified: expect.any(Date),
			}),
		);
		expect(mockInvalidateCache).toHaveBeenCalledWith("list:detail:list-1:*");
		expect(mockInvalidateCache).toHaveBeenCalledWith("list:shared:list-1");
	});

	it("should ensure items have correct listId when provided", async () => {
		const mockRepository = createMockRepository();
		const mockList = createMockShoppingList({ id: "list-1" });
		mockRepository.findById.mockResolvedValue(mockList);
		mockRepository.update.mockResolvedValue(undefined);

		const useCase = new UpdateListUseCase(mockRepository);
		const updateData = {
			items: [{ name: "Item 1", price: 10 }] as any,
		};
		await useCase.execute("list-1", updateData);

		expect(mockRepository.update).toHaveBeenCalledWith(
			"list-1",
			expect.objectContaining({
				items: [expect.objectContaining({ listId: "list-1" })],
			}),
		);
	});

	it("should throw error when list does not exist", async () => {
		const mockRepository = createMockRepository();
		mockRepository.findById.mockResolvedValue(null);

		const useCase = new UpdateListUseCase(mockRepository);

		await expect(useCase.execute("non-existent", {})).rejects.toThrow(
			"Lista não encontrada",
		);
		expect(mockRepository.update).not.toHaveBeenCalled();
	});
});
