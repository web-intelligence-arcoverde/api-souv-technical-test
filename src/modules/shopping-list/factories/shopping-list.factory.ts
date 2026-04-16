import { ShoppingListController } from "../controllers/shopping-list.controller";
import { ShoppingListRepository } from "../repositories/shopping-list.repository";
import { CreateListUseCase } from "../usecases/create-list.usecase";
import { DeleteListUseCase } from "../usecases/delete-list.usecase";
import { GetListUseCase } from "../usecases/get-list.usecase";
import { ListListsFilteredUseCase } from "../usecases/list-lists-filtered.usecase";
import { UpdateListUseCase } from "../usecases/update-list.usecase";

export const makeShoppingListController = (): ShoppingListController => {
	const listRepository = new ShoppingListRepository();
	const createListUseCase = new CreateListUseCase();
	const listListsUseCase = new ListListsFilteredUseCase(listRepository);
	const getListUseCase = new GetListUseCase(listRepository);
	const updateListUseCase = new UpdateListUseCase(listRepository);
	const deleteListUseCase = new DeleteListUseCase(listRepository);

	return new ShoppingListController(
		createListUseCase,
		listListsUseCase,
		getListUseCase,
		updateListUseCase,
		deleteListUseCase,
	);
};
