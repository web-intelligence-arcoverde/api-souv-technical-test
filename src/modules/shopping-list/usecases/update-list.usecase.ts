import { invalidateCacheByPattern } from "../../../infra/cache/redis.helper";
import type { IProduct } from "../../product/entities/product";
import type { IShoppingList } from "../entities/shopping-list";
import type { IShoppingListRepository } from "../repositories/shopping-list.repository.interface";

export type UpdateListDTO = Partial<Omit<IShoppingList, "items">> & {
	items?: (Omit<IProduct, "listId"> & { listId?: string })[];
};

export class UpdateListUseCase {
	constructor(private readonly listRepository: IShoppingListRepository) {}

	async execute(id: string, data: UpdateListDTO): Promise<void> {
		const list = await this.listRepository.findById(id);
		if (!list) {
			throw new Error("Lista não encontrada");
		}

		// Garante que todos os itens tenham o listId correto se eles forem fornecidos no update
		const updateData: Partial<IShoppingList> = {
			...data,
			items: data.items
				? (data.items.map((item) => ({ ...item, listId: id })) as IProduct[])
				: undefined,
			lastModified: new Date(),
		};

		await this.listRepository.update(id, updateData);

		// Invalida a lista compartilhada e detalhes da lista
		await invalidateCacheByPattern(`list:detail:${id}:*`);
		await invalidateCacheByPattern(`list:shared:${id}`);
	}
}
