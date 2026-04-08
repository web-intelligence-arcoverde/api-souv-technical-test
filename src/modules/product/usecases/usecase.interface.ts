export interface IUseCase {
	execute(data: unknown): Promise<unknown>;
}
