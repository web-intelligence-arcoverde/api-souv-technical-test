import type { IPagination } from "../entities/pagination";
import type { IProduct } from "../entities/product";

export interface IProductRepository {
	findAll(page: number, limit: number, listId: string): Promise<IPagination>;
	findById(id: string): Promise<IProduct | null>;
	create(data: IProduct): Promise<IProduct>;

	delete(id: string): Promise<void>;
	toggleProductChecked(id: string, checked: boolean): Promise<void>;
}
