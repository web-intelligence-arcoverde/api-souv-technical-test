import { ShoppingListController } from "../controllers/shopping-list.controller";
import { ShoppingListRepository } from "../repositories/shopping-list.repository";
import { CreateListUseCase } from "../usecases/create-list.usecase";
import { ListListsUseCase } from "../usecases/list-lists.usecase";

export const makeShoppingListController = (): ShoppingListController => {
	const listRepository = new ShoppingListRepository();
	const createListUseCase = new CreateListUseCase(listRepository);
	const listListsUseCase = new ListListsUseCase(listRepository);

	return new ShoppingListController(createListUseCase, listListsUseCase);
};
