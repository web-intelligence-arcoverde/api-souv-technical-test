import { invalidateCacheByPattern } from "../../../../infra/cache/redis.helper";
import { ProductRepository } from "../../repositories/product-repository";
import { CreateProductUseCase } from "../create-product.usecase";

jest.mock("../../repositories/product-repository");
jest.mock("../../../../infra/cache/redis.helper");

describe("CreateProductUseCase", () => {
	let createProductUseCase: CreateProductUseCase;
	let productRepository: jest.Mocked<ProductRepository>;

	beforeEach(() => {
		productRepository =
			new ProductRepository() as jest.Mocked<ProductRepository>;
		createProductUseCase = new CreateProductUseCase(productRepository);
		jest.clearAllMocks();
	});

	it("should create a product and invalidate the cache", async () => {
		const productData = {
			name: "Test Product",
			category: "Test Category",
			quantity: 1,
			unit: "kg",
			checked: false,
		};

		const createdProduct = { id: 1, ...productData };
		productRepository.create.mockResolvedValue(createdProduct);

		const result = await createProductUseCase.execute(productData);

		expect(productRepository.create).toHaveBeenCalledWith(productData);
		expect(invalidateCacheByPattern).toHaveBeenCalledWith("products:page:*");
		expect(result).toEqual(createdProduct);
	});
});
