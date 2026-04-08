import type { RequestHandler } from "express";
import type { DeleteUserUseCase } from "../usecases/delete-user.usecase";
import type { ListUsersUseCase } from "../usecases/list-users.usecase";
import type { LoginUserUseCase } from "../usecases/login-user.usecase";
import type { RegisterUserUseCase } from "../usecases/register-user.usecase";
import type { UpdateUserUseCase } from "../usecases/update-user.usecase";
import { loginSchema } from "../validations/login.schema";
import { registerSchema } from "../validations/register.schema";
import { updateAccountSchema } from "../validations/update-account.schema";

export class AuthController {
	constructor(
		private readonly registerUseCase: RegisterUserUseCase,
		private readonly loginUseCase: LoginUserUseCase,
		private readonly updateUserUseCase: UpdateUserUseCase,
		private readonly deleteUserUseCase: DeleteUserUseCase,
		private readonly listUsersUseCase: ListUsersUseCase,
	) {}

	register: RequestHandler = async (req, res, next) => {
		try {
			const data = registerSchema.parse(req.body);
			const result = await this.registerUseCase.execute(data);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	};

	login: RequestHandler = async (req, res, next) => {
		try {
			const data = loginSchema.parse(req.body);
			const result = await this.loginUseCase.execute(data);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};

	updateAccount: RequestHandler = async (req, res, next) => {
		try {
			const { uid } = req.params;
			const data = updateAccountSchema.parse(req.body);
			await this.updateUserUseCase.execute({ uid, ...data });
			res.status(200).json({ message: "Account updated successfully" });
		} catch (error) {
			next(error);
		}
	};

	deleteAccount: RequestHandler = async (req, res, next) => {
		try {
			const { uid } = req.params;
			await this.deleteUserUseCase.execute(uid);
			res.status(200).json({ message: "Account deleted successfully" });
		} catch (error) {
			next(error);
		}
	};

	listUsers: RequestHandler = async (_req, res, next) => {
		try {
			const result = await this.listUsersUseCase.execute();
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};
}
