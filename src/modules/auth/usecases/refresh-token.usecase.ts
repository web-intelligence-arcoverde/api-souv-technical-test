import type { IAuthRepository } from "../repositories/auth.repository.interface";

export class RefreshTokenUseCase {
	constructor(private authRepository: IAuthRepository) {}

	async execute(
		refreshToken: string,
	): Promise<{ idToken: string; refreshToken: string }> {
		return await this.authRepository.refresh(refreshToken);
	}
}
