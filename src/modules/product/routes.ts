import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import { RedisCacheProvider } from "../../infra/cache/redis.provider";
import { CreateProductController } from "./controllers/create-product.controller";
import { DeleteProductController } from "./controllers/delete-product.controller";
import { ListProductController } from "./controllers/list-product.controller";
import { ToggleCheckedProductController } from "./controllers/toggle-checked-product.controller";
import { ProductRepository } from "./repositories/product-repository";
import { CreateProductUseCase } from "./usecases/create-product.usecase";
import { DeleteProductUseCase } from "./usecases/delete-product.usecase";
import { ListProductsUseCase } from "./usecases/list-product.usecase";
import { ToggleChangeProductCheckedUseCase } from "./usecases/toggle-change-product-checked.usecase";

const router = express.Router();

const cache = new RedisCacheProvider();

const productRepository = new ProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);

const listProductUseCase = new ListProductsUseCase(productRepository, cache);

const listProductController = new ListProductController(listProductUseCase);

const createProductController = new CreateProductController(
	createProductUseCase,
);

const toggleCheckedProductUseCase = new ToggleChangeProductCheckedUseCase(
	productRepository,
	cache,
);

const toggleCheckedProductController = new ToggleCheckedProductController(
	toggleCheckedProductUseCase,
);

const deleteProductUseCase = new DeleteProductUseCase(productRepository, cache);
const deleteProductController = new DeleteProductController(
	deleteProductUseCase,
);

router.delete(
	"/:id",
	async (request: Request, response: Response, next: NextFunction) => {
		try {
			await deleteProductController.handle(request, response, next);
		} catch (error) {
			next(error);
		}
	},
);

router.patch(
	"/:id/checked",
	async (request: Request, response: Response, next: NextFunction) => {
		try {
			await toggleCheckedProductController.handle(request, response, next);
		} catch (error) {
			next(error);
		}
	},
);

router.get(
	"/",
	async (request: Request, response: Response, next: NextFunction) => {
		try {
			await listProductController.handle(request, response, next);
		} catch (error) {
			next(error);
		}
	},
);

router.post(
	"/",
	async (request: Request, response: Response, next: NextFunction) => {
		try {
			await createProductController.handle(request, response, next);
		} catch (error) {
			next(error);
		}
	},
);

export default router;
