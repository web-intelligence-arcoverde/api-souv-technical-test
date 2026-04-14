import * as admin from "firebase-admin";
import type { ICacheProvider } from "../../../infra/cache/cache-provider.interface";
import type { IShoppingListRepository } from "../../shopping-list/repositories/shopping-list.repository.interface";
import type { IProductRepository } from "../repositories/product-repository.interface";
import type { IUseCase } from "./usecase.interface";

export class DeleteProductUseCase implements IUseCase {
	constructor(
		private productRepository: IProductRepository,
		private cacheProvider: ICacheProvider,
		private shoppingListRepository: IShoppingListRepository,
	) {}

	async execute(data: { id: string; listId: string }) {
		const { id, listId } = data;

		// Busca o produto antes de deletar para saber se estava marcado
		const product = await this.productRepository.findById(id, listId);
		if (!product) return;

		const result = await this.productRepository.delete(id, listId);

		// Atualiza contadores na lista pai
		await this.shoppingListRepository.update(listId, {
			// biome-ignore lint/suspicious/noExplicitAny: Atomic decrement
			totalItems: admin.firestore.FieldValue.increment(-1) as any,
			securedItems: product.checked
				? (admin.firestore.FieldValue.increment(-1) as any)
				: undefined,
			lastModified: new Date(),
		});

		// Invalida cache de produtos (paginado)
		await this.cacheProvider.invalidateByPattern(
			`products:page:*:list:${listId}`,
		);

		// Invalida cache de detalhes da lista (usado no GetList)
		await this.cacheProvider.invalidateByPattern(`list:detail:${listId}:*`);
		await this.cacheProvider.invalidateByPattern(`list:shared:${listId}`);

		return result;
	}
}
