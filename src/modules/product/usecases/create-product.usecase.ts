import * as admin from "firebase-admin";
import type { ICacheProvider } from "../../../infra/cache/cache-provider.interface";
import type { IShoppingListRepository } from "../../shopping-list/repositories/shopping-list.repository.interface";
import type { IProduct } from "../entities/product";
import type { ProductRepository } from "../repositories/product-repository";
import type { IUseCase } from "./usecase.interface";

export class CreateProductUseCase implements IUseCase {
	constructor(
		private readonly productRepository: ProductRepository,
		private readonly cacheProvider: ICacheProvider,
		private readonly shoppingListRepository: IShoppingListRepository,
	) {}

	async execute(data: IProduct) {
		const product = await this.productRepository.create(data);

		// Atualiza o contador de itens totais na lista pai
		await this.shoppingListRepository.update(data.listId, {
			// biome-ignore lint/suspicious/noExplicitAny: Atomic increment
			totalItems: admin.firestore.FieldValue.increment(1) as any,
			lastModified: new Date(),
		});

		// Invalida cache de produtos (paginado)
		await this.cacheProvider.invalidateByPattern(
			`products:page:*:list:${data.listId}`,
		);

		// Invalida cache de detalhes da lista (usado no GetList)
		await this.cacheProvider.invalidateByPattern(
			`list:detail:${data.listId}:*`,
		);
		await this.cacheProvider.invalidateByPattern(`list:shared:${data.listId}`);

		return product;
	}
}
