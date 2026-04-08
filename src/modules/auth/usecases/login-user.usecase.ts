import type { IAuthRepository } from "../repositories/auth.repository";

export interface ILoginData {
	email: string;
	password: string;
}

export class LoginUserUseCase {
	constructor(private readonly authRepository: IAuthRepository) {}

	async execute(data: ILoginData) {
		const { email, password } = data;
		const authUser = await this.authRepository.login(email, password);

		return authUser;
	}
}
