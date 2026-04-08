export interface IAuthUser {
	uid: string;
	email: string;
	name: string;
	token: string;
}

export interface IAuthRepository {
	register(email: string, password: string, name: string): Promise<IAuthUser>;
	login(email: string, password: string): Promise<IAuthUser>;
	logout(): Promise<void>;
	resetPassword(email: string): Promise<void>;
	update(uid: string, data: { name?: string; email?: string }): Promise<void>;
	delete(uid: string): Promise<void>;
	findAll(): Promise<Omit<IAuthUser, "token">[]>;
}
