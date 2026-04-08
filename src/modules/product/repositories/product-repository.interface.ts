import type { IPagination } from "../entities/pagination";
import type { IProduct } from "../entities/product";

export interface IProductRepository {
	findAll(page: number, limit: number): Promise<IPagination>;
	findById(id: string | number): Promise<IProduct | null>;
	create(data: IProduct): Promise<IProduct>;
	toggleProductChecked(id: string | number, checked: boolean): Promise<void>;
	delete(id: string | number): Promise<void>;
}
