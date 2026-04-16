import { jest } from "@jest/globals";
import { DeleteListUseCase } from "../../usecases/delete-list.usecase";
import {
	createMockRepository,
	createMockShoppingList,
} from "../helpers/shopping-list.test.helper";

const mockInvalidateCache = jest.fn();

jest.mock("../../../../infra/cache/redis.helper", () => ({
	invalidateCacheByPattern: (pattern: string) => mockInvalidateCache(pattern),
}));

describe("DeleteListUseCase", () => {
	beforeEach(() => {
		mockInvalidateCache.mockClear();
	});

	it("should delete list and invalidate cache when list exists", async () => {
		const mockRepository = createMockRepository();
		const mockList = createMockShoppingList({
			id: "list-1",
			ownerId: "user-1",
		});
		mockRepository.findById.mockResolvedValue(mockList);
		mockRepository.delete.mockResolvedValue(undefined);

		const useCase = new DeleteListUseCase(mockRepository);
		await useCase.execute("list-1");

		expect(mockRepository.delete).toHaveBeenCalledWith("list-1");
		expect(mockInvalidateCache).toHaveBeenCalledWith("lists:user:user-1:*");
		expect(mockInvalidateCache).toHaveBeenCalledWith("list:detail:list-1:*");
		expect(mockInvalidateCache).toHaveBeenCalledWith("list:shared:list-1");
	});

	it("should throw error when list does not exist", async () => {
		const mockRepository = createMockRepository();
		mockRepository.findById.mockResolvedValue(null);

		const useCase = new DeleteListUseCase(mockRepository);

		await expect(useCase.execute("non-existent")).rejects.toThrow(
			"Lista não encontrada",
		);
		expect(mockRepository.delete).not.toHaveBeenCalled();
	});
});
