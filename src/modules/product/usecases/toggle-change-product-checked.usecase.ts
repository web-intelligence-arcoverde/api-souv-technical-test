import type { ICacheProvider } from "../../../infra/cache/cache-provider.interface";
import type { IProductRepository } from "../repositories/product-repository.interface";
import type { IUseCase } from "./usecase.interface";

export class ToggleChangeProductCheckedUseCase implements IUseCase {
	constructor(
		private productRepository: IProductRepository,
		private cacheProvider: ICacheProvider,
	) {}

	async execute(data: { id: string | number; checked: boolean }) {
		const { id, checked } = data;
		const updated = await this.productRepository.toggleProductChecked(
			id,
			checked,
		);
		await this.cacheProvider.invalidateByPattern("products:page:*");
		return updated;
	}
}
