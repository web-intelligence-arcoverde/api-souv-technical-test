import { RedisCacheProvider } from "../../../infra/cache/redis.provider";
import { CreateProductController } from "../controllers/create-product.controller";
import { DeleteProductController } from "../controllers/delete-product.controller";
import { ListProductController } from "../controllers/list-product.controller";
import { ToggleCheckedProductController } from "../controllers/toggle-checked-product.controller";
import { ProductRepository } from "../repositories/product-repository";
import { CreateProductUseCase } from "../usecases/create-product.usecase";
import { DeleteProductUseCase } from "../usecases/delete-product.usecase";
import { ListProductsUseCase } from "../usecases/list-product.usecase";
import { ToggleChangeProductCheckedUseCase } from "../usecases/toggle-change-product-checked.usecase";

const getDependencies = () => {
	const repository = new ProductRepository();
	const cache = new RedisCacheProvider();
	return { repository, cache };
};

export const makeListProductController = (): ListProductController => {
	const { repository, cache } = getDependencies();
	const useCase = new ListProductsUseCase(repository, cache);
	return new ListProductController(useCase);
};

export const makeCreateProductController = (): CreateProductController => {
	const { repository } = getDependencies();
	const useCase = new CreateProductUseCase(repository);
	return new CreateProductController(useCase);
};

export const makeToggleCheckedProductController =
	(): ToggleCheckedProductController => {
		const { repository, cache } = getDependencies();
		const useCase = new ToggleChangeProductCheckedUseCase(repository, cache);
		return new ToggleCheckedProductController(useCase);
	};

export const makeDeleteProductController = (): DeleteProductController => {
	const { repository, cache } = getDependencies();
	const useCase = new DeleteProductUseCase(repository, cache);
	return new DeleteProductController(useCase);
};
