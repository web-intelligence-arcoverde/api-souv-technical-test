import type { IAuthRepository } from "../repositories/auth.repository";

export interface IUpdateUserData {
	uid: string;
	name?: string;
	email?: string;
}

export class UpdateUserUseCase {
	constructor(private readonly authRepository: IAuthRepository) {}

	async execute(data: IUpdateUserData): Promise<void> {
		const { uid, name, email } = data;
		await this.authRepository.update(uid, { name, email });
	}
}
