import * as admin from "firebase-admin";
import type { ICacheProvider } from "../../../infra/cache/cache-provider.interface";
import { db } from "../../../infra/firestore";
import type { IShoppingListRepository } from "../../shopping-list/repositories/shopping-list.repository.interface";
import type { IProductRepository } from "../repositories/product-repository.interface";
import type { IUseCase } from "./usecase.interface";

export class ToggleChangeProductCheckedUseCase implements IUseCase {
	constructor(
		private productRepository: IProductRepository,
		private cacheProvider: ICacheProvider,
		private shoppingListRepository: IShoppingListRepository,
	) {}

	async execute(data: { id: string; checked: boolean }) {
		const { id, checked } = data;

		const product = await this.productRepository.findById(id);

		if (!product) {
			throw new Error("Product not found");
		}

		const listId = product.listId;

		const updated = await this.productRepository.toggleProductChecked(
			id,
			checked,
		);

		// Atualiza o contador de itens marcados na lista pai
		await this.shoppingListRepository.update(listId, {
			securedItems: admin.firestore.FieldValue.increment(
				checked ? 1 : -1,
			) as any,
			lastModified: new Date(),
		});

		// Invalida cache de produtos (paginado)
		await this.cacheProvider.invalidateByPattern(
			`products:page:*:list:${listId}`,
		);

		// Invalida cache de detalhes da lista (usado no GetList)
		await this.cacheProvider.invalidateByPattern(`list:detail:${listId}:*`);
		await this.cacheProvider.invalidateByPattern(`list:shared:${listId}`);

		return updated;
	}
}
