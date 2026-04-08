export interface IAuthUser {
	uid: string;
	email: string;
	name: string;
	token: string;
	refreshToken: string;
}

export interface IAuthRepository {
	register(email: string, password: string, name: string): Promise<IAuthUser>;
	login(email: string, password: string): Promise<IAuthUser>;
	refresh(
		refreshToken: string,
	): Promise<{ idToken: string; refreshToken: string }>;
	logout(): Promise<void>;
	resetPassword(email: string): Promise<void>;
	update(uid: string, data: { name?: string; email?: string }): Promise<void>;
	delete(uid: string): Promise<void>;
	findAll(): Promise<Omit<IAuthUser, "token" | "refreshToken">[]>;
}
