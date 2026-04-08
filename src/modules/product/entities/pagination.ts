import type { IProduct } from "./product";

export interface IPagination {
	data: IProduct[];
	total: number;
	totalPages: number;
	currentPage: number;
}
