import type { ICacheProvider } from "../../../infra/cache/cache-provider.interface";
import type { IProductRepository } from "../repositories/product-repository.interface";
import type { IUseCase } from "./usecase.interface";

export class ListProductsUseCase implements IUseCase {
	constructor(
		private productRepository: IProductRepository,
		private cacheProvider: ICacheProvider,
	) {}

	async execute(data: { page?: number; limit?: number }) {
		const { page = 1, limit = 10 } = data;

		const cacheKey = `products:page:${page}:limit:${limit}`;

		const cached = await this.cacheProvider.get(cacheKey);
		if (cached) {
			return cached;
		}

		const products = await this.productRepository.findAll(
			Number(page),
			Number(limit),
		);

		await this.cacheProvider.set(cacheKey, products, 60 * 5); // 5 minutos

		return products;
	}
}
