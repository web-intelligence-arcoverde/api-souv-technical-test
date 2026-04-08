import type { IPagination } from "../entities/pagination";
import type { IProduct } from "../entities/product";
import type { IProductRepository } from "./product-repository.interface";

export class ProductRepository implements IProductRepository {
	async findAll(_page: number, _limit: number): Promise<IPagination> {
		console.warn(
			"ProductRepository.findAll: SQL removed. Please implement Firestore repository.",
		);
		return {
			data: [],
			total: 0,
			totalPages: 0,
			currentPage: _page,
		};
	}

	async create(_data: IProduct): Promise<IProduct> {
		console.error(
			"ProductRepository.create: SQL removed. Firestore migration pending.",
		);
		throw new Error(
			"Repository method not implemented: Migration to Firestore in progress.",
		);
	}

	async findById(_id: string | number): Promise<IProduct | null> {
		console.warn("ProductRepository.findById: SQL removed. Returning null.");
		return null;
	}

	async toggleProductChecked(
		_id: string | number,
		_checked: boolean,
	): Promise<void> {
		console.error(
			"ProductRepository.toggleProductChecked: SQL removed. Firestore migration pending.",
		);
		throw new Error(
			"Repository method not implemented: Migration to Firestore in progress.",
		);
	}

	async delete(_id: string | number): Promise<void> {
		console.error(
			"ProductRepository.delete: SQL removed. Firestore migration pending.",
		);
		throw new Error(
			"Repository method not implemented: Migration to Firestore in progress.",
		);
	}
}
