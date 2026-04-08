import type { IAuthRepository } from "../repositories/auth.repository";

export class DeleteUserUseCase {
	constructor(private readonly authRepository: IAuthRepository) {}

	async execute(uid: string): Promise<void> {
		await this.authRepository.delete(uid);
	}
}
