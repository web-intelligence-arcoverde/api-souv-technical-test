import type { IShoppingList } from "../entities/shopping-list";

export interface ListListsFilters {
	ownerId?: string;
	category?: string;
	shared?: boolean;
	variant?: string;
}

export interface IShoppingListRepository {
	create(data: IShoppingList): Promise<IShoppingList>;
	findAllByUserId(
		userId: string,
		limit?: number,
		offset?: number,
	): Promise<IShoppingList[]>;
	findAll(
		filters: ListListsFilters,
		limit?: number,
		offset?: number,
	): Promise<IShoppingList[]>;
	findById(id: string): Promise<IShoppingList | null>;
	update(id: string, data: Partial<IShoppingList>): Promise<void>;
	delete(id: string): Promise<void>;
}
