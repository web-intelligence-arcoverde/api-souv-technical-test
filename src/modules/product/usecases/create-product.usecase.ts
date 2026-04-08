import { invalidateCacheByPattern } from "../../../infra/cache/redis.helper";
import type { IProduct } from "../entities/product";
import type { ProductRepository } from "../repositories/product-repository";
import type { IUseCase } from "./usecase.interface";

export class CreateProductUseCase implements IUseCase {
	constructor(private readonly productRepository: ProductRepository) {}
	async execute(data: IProduct) {
		const user = await this.productRepository.create(data);
		await invalidateCacheByPattern("products:page:*");
		return user;
	}
}
