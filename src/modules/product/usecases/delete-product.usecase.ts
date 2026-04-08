import type { ICacheProvider } from "../../../infra/cache/cache-provider.interface";
import type { IProductRepository } from "../repositories/product-repository.interface";
import type { IUseCase } from "./usecase.interface";

export class DeleteProductUseCase implements IUseCase {
	constructor(
		private productRepository: IProductRepository,
		private cacheProvider: ICacheProvider,
	) {}

	async execute(data: { id: string | number }) {
		const { id } = data;
		const deletedProduct = await this.productRepository.delete(id);
		await this.cacheProvider.invalidateByPattern("products:page:*");
		return deletedProduct;
	}
}
