import { jest } from "@jest/globals";
import { ListListsFilteredUseCase } from "../../usecases/list-lists-filtered.usecase";
import {
	createMockRepository,
	createMockShoppingList,
} from "../helpers/shopping-list.test.helper";

describe("ListListsFilteredUseCase", () => {
	it("should call repository with correct filters and pagination", async () => {
		const mockRepository = createMockRepository();
		const mockLists = [createMockShoppingList()];
		mockRepository.findAll.mockResolvedValue(mockLists);

		const useCase = new ListListsFilteredUseCase(mockRepository);
		const result = await useCase.execute({
			userId: "user-1",
			category: "Grocery",
			shared: true,
			page: 2,
			limit: 5,
		});

		expect(result).toEqual(mockLists);
		expect(mockRepository.findAll).toHaveBeenCalledWith(
			{
				ownerId: "user-1",
				category: "Grocery",
				shared: true,
				variant: undefined,
			},
			5,
			5, // (page 2 - 1) * limit 5 = 5
		);
	});

	it("should use default pagination values", async () => {
		const mockRepository = createMockRepository();
		mockRepository.findAll.mockResolvedValue([]);

		const useCase = new ListListsFilteredUseCase(mockRepository);
		await useCase.execute({ userId: "user-1" });

		expect(mockRepository.findAll).toHaveBeenCalledWith(
			{
				ownerId: "user-1",
				category: undefined,
				shared: undefined,
				variant: undefined,
			},
			10, // default limit
			0, // default offset
		);
	});
});
