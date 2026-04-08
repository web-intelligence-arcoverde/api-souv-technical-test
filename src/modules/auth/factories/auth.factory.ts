import { AuthController } from "../controllers/auth.controller";
import { AuthRepository } from "../repositories/auth.repository";
import { DeleteUserUseCase } from "../usecases/delete-user.usecase";
import { ListUsersUseCase } from "../usecases/list-users.usecase";
import { LoginUserUseCase } from "../usecases/login-user.usecase";
import { RefreshTokenUseCase } from "../usecases/refresh-token.usecase";
import { RegisterUserUseCase } from "../usecases/register-user.usecase";
import { UpdateUserUseCase } from "../usecases/update-user.usecase";

export const makeAuthController = (): AuthController => {
	const authRepository = new AuthRepository();
	const registerUseCase = new RegisterUserUseCase(authRepository);
	const loginUseCase = new LoginUserUseCase(authRepository);
	const updateUserUseCase = new UpdateUserUseCase(authRepository);
	const deleteUserUseCase = new DeleteUserUseCase(authRepository);
	const listUsersUseCase = new ListUsersUseCase(authRepository);
	const refreshTokenUseCase = new RefreshTokenUseCase(authRepository);

	return new AuthController(
		registerUseCase,
		loginUseCase,
		updateUserUseCase,
		deleteUserUseCase,
		listUsersUseCase,
		refreshTokenUseCase,
	);
};
