import { jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { ShoppingListController } from "../../controllers/shopping-list.controller";
import type { CreateListUseCase } from "../../usecases/create-list.usecase";
import type { DeleteListUseCase } from "../../usecases/delete-list.usecase";
import type { GetListUseCase } from "../../usecases/get-list.usecase";
import type { ListListsFilteredUseCase } from "../../usecases/list-lists-filtered.usecase";
import type { UpdateListUseCase } from "../../usecases/update-list.usecase";

export const setupControllerTest = () => {
	const mockCreateUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<CreateListUseCase>;
	const mockListUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<ListListsFilteredUseCase>;
	const mockGetUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<GetListUseCase>;
	const mockUpdateUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<UpdateListUseCase>;
	const mockDeleteUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<DeleteListUseCase>;

	const controller = new ShoppingListController(
		mockCreateUseCase,
		mockListUseCase,
		mockGetUseCase,
		mockUpdateUseCase,
		mockDeleteUseCase,
	);

	const req: Partial<Request> = {
		query: {},
		params: {},
		body: {},
	};
	const res: Partial<Response> = {
		status: jest.fn().mockReturnThis() as any,
		json: jest.fn().mockReturnThis() as any,
	};
	const next: NextFunction = jest.fn() as any;

	return {
		controller,
		mockCreateUseCase,
		mockListUseCase,
		mockGetUseCase,
		mockUpdateUseCase,
		mockDeleteUseCase,
		req,
		res,
		next,
	};
};
