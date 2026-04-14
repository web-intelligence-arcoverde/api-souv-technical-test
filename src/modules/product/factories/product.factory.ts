import { RedisCacheProvider } from "../../../infra/cache/redis.provider";
import { ShoppingListRepository } from "../../shopping-list/repositories/shopping-list.repository";
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
	const shoppingListRepository = new ShoppingListRepository();
	return { repository, cache, shoppingListRepository };
};

export const makeListProductController = (): ListProductController => {
	const { repository, cache } = getDependencies();
	const useCase = new ListProductsUseCase(repository, cache);
	return new ListProductController(useCase);
};

export const makeCreateProductController = (): CreateProductController => {
	const { repository, cache, shoppingListRepository } = getDependencies();
	const useCase = new CreateProductUseCase(
		repository,
		cache,
		shoppingListRepository,
	);
	return new CreateProductController(useCase);
};

export const makeToggleCheckedProductController =
	(): ToggleCheckedProductController => {
		const { repository, cache, shoppingListRepository } = getDependencies();
		const useCase = new ToggleChangeProductCheckedUseCase(
			repository,
			cache,
			shoppingListRepository,
		);
		return new ToggleCheckedProductController(useCase);
	};

export const makeDeleteProductController = (): DeleteProductController => {
	const { repository, cache, shoppingListRepository } = getDependencies();
	const useCase = new DeleteProductUseCase(
		repository,
		cache,
		shoppingListRepository,
	);
	return new DeleteProductController(useCase);
};
