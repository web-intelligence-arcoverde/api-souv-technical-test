import * as admin from "firebase-admin";
import type { ICacheProvider } from "../../../../infra/cache/cache-provider.interface";
import type { IShoppingListRepository } from "../../../shopping-list/repositories/shopping-list.repository.interface";
import { ProductRepository } from "../../repositories/product-repository";
import { CreateProductUseCase } from "../create-product.usecase";

jest.mock("firebase-admin", () => {
	const mockFirestore = jest.fn(() => ({
		collection: jest.fn().mockReturnThis(),
		doc: jest.fn().mockReturnThis(),
		update: jest.fn(),
	}));

	// @ts-expect-error
	mockFirestore.FieldValue = {
		increment: jest.fn((val) => `increment(${val})`),
	};

	return {
		auth: jest.fn(),
		firestore: mockFirestore,
		credential: {
			cert: jest.fn(),
		},
		initializeApp: jest.fn(),
		apps: [],
	};
});
jest.mock("../../repositories/product-repository");

describe("CreateProductUseCase", () => {
	let createProductUseCase: CreateProductUseCase;
	let productRepository: jest.Mocked<ProductRepository>;
	let cacheProvider: jest.Mocked<ICacheProvider>;
	let shoppingListRepository: jest.Mocked<IShoppingListRepository>;

	beforeEach(() => {
		productRepository =
			new ProductRepository() as jest.Mocked<ProductRepository>;
		cacheProvider = {
			invalidateByPattern: jest.fn().mockResolvedValue(undefined),
			get: jest.fn(),
			set: jest.fn(),
			del: jest.fn(),
		} as unknown as jest.Mocked<ICacheProvider>;
		shoppingListRepository = {
			update: jest.fn().mockResolvedValue(undefined),
		} as unknown as jest.Mocked<IShoppingListRepository>;

		createProductUseCase = new CreateProductUseCase(
			productRepository,
			cacheProvider,
			shoppingListRepository,
		);
		jest.clearAllMocks();
	});

	it("should create a product, update list count and invalidate the cache", async () => {
		const productData = {
			name: "Test Product",
			category: "Test Category",
			marketName: "Test Market",
			price: 10.5,
			quantity: 1,
			unit: "kg",
			checked: false,
			listId: "list-123",
		};

		const createdProduct = { id: 1, ...productData };
		productRepository.create.mockResolvedValue(createdProduct as any);

		const result = await createProductUseCase.execute(productData as any);

		expect(productRepository.create).toHaveBeenCalledWith(productData);
		expect(shoppingListRepository.update).toHaveBeenCalledWith(
			productData.listId,
			expect.objectContaining({
				totalItems: "increment(1)",
			}),
		);
		expect(cacheProvider.invalidateByPattern).toHaveBeenCalledWith(
			`products:page:*:list:${productData.listId}`,
		);
		expect(cacheProvider.invalidateByPattern).toHaveBeenCalledWith(
			`list:detail:${productData.listId}:*`,
		);
		expect(result).toEqual(createdProduct);
	});
});
