import type { IShoppingList } from "../entities/shopping-list";
import type {
	IShoppingListRepository,
	ListListsFilters,
} from "../repositories/shopping-list.repository.interface";

export interface ListListsFilteredDTO {
	userId?: string;
	category?: string;
	shared?: boolean;
	variant?: string;
	page?: number;
	limit?: number;
}

export class ListListsFilteredUseCase {
	constructor(private readonly listRepository: IShoppingListRepository) {}

	async execute(data: ListListsFilteredDTO): Promise<IShoppingList[]> {
		const page = data.page || 1;
		const limit = data.limit || 10;
		const offset = (page - 1) * limit;

		const filters: ListListsFilters = {
			ownerId: data.userId,
			category: data.category,
			shared: data.shared,
			variant: data.variant,
		};

		return await this.listRepository.findAll(filters, limit, offset);
	}
}
