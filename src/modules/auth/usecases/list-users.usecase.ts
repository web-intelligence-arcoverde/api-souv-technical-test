import type { IAuthRepository } from "../repositories/auth.repository.interface";

export class ListUsersUseCase {
	constructor(private readonly authRepository: IAuthRepository) {}

	async execute() {
		return await this.authRepository.findAll();
	}
}
