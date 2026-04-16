import { jest } from "@jest/globals";
import { GetListUseCase } from "../../usecases/get-list.usecase";
import {
	createMockRepository,
	createMockShoppingList,
} from "../helpers/shopping-list.test.helper";

describe("GetListUseCase", () => {
	it("should return a list when it exists", async () => {
		const mockRepository = createMockRepository();
		const mockList = createMockShoppingList();
		mockRepository.findById.mockResolvedValue(mockList);

		const useCase = new GetListUseCase(mockRepository);
		const result = await useCase.execute("list-1");

		expect(result).toEqual(mockList);
		expect(mockRepository.findById).toHaveBeenCalledWith("list-1");
	});

	it("should throw error when the list does not exist", async () => {
		const mockRepository = createMockRepository();
		mockRepository.findById.mockResolvedValue(null);

		const useCase = new GetListUseCase(mockRepository);

		await expect(useCase.execute("non-existent")).rejects.toThrow(
			"Lista não encontrada",
		);
		expect(mockRepository.findById).toHaveBeenCalledWith("non-existent");
	});
});
