import { jest } from "@jest/globals";
import type { IShoppingList } from "../../entities/shopping-list";
import type { IShoppingListRepository } from "../../repositories/shopping-list.repository.interface";

export const createMockShoppingList = (
	overrides: Partial<IShoppingList> = {},
): IShoppingList => ({
	id: "list-1",
	title: "Test List",
	description: "Test Description",
	category: "Grocery",
	variant: "primary",
	totalItems: 0,
	securedItems: 0,
	items: [],
	ownerId: "user-1",
	shared: false,
	lastModified: new Date(),
	...overrides,
});

export const createMockRepository =
	(): jest.Mocked<IShoppingListRepository> => ({
		create: jest.fn<any>(),
		findAllByUserId: jest.fn<any>(),
		findAll: jest.fn<any>(),
		findById: jest.fn<any>(),
		update: jest.fn<any>(),
		delete: jest.fn<any>(),
	});

export const mockRedisHelper = {
	invalidateCacheByPattern: jest.fn<any>(),
};

export const mockShoppingListQueue = {
	add: jest.fn<any>(),
};
