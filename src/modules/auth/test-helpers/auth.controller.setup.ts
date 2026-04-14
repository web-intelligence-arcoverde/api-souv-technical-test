import type { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/auth.controller";
import type { DeleteUserUseCase } from "../usecases/delete-user.usecase";
import type { ListUsersUseCase } from "../usecases/list-users.usecase";
import type { LoginUserUseCase } from "../usecases/login-user.usecase";
import type { RefreshTokenUseCase } from "../usecases/refresh-token.usecase";
import type { RegisterUserUseCase } from "../usecases/register-user.usecase";
import type { UpdateUserUseCase } from "../usecases/update-user.usecase";

/**
 * Sets up the mocks and the controller for AuthController unit tests.
 * This helper centralizes the initialization logic to avoid duplication across test files.
 */
export const setupAuthControllerTest = () => {
	const mockRegisterUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<RegisterUserUseCase>;
	const mockLoginUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<LoginUserUseCase>;
	const mockUpdateUserUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<UpdateUserUseCase>;
	const mockDeleteUserUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<DeleteUserUseCase>;
	const mockListUsersUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<ListUsersUseCase>;
	const mockRefreshTokenUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<RefreshTokenUseCase>;

	const authController = new AuthController(
		mockRegisterUseCase,
		mockLoginUseCase,
		mockUpdateUserUseCase,
		mockDeleteUserUseCase,
		mockListUsersUseCase,
		mockRefreshTokenUseCase,
	);

	const req: Partial<Request> = {};
	const res: Partial<Response> = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn().mockReturnThis(),
	};
	const next: NextFunction = jest.fn();

	return {
		authController,
		mockRegisterUseCase,
		mockLoginUseCase,
		mockUpdateUserUseCase,
		mockDeleteUserUseCase,
		mockListUsersUseCase,
		mockRefreshTokenUseCase,
		req,
		res,
		next,
	};
};
