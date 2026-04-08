import { db } from "../../../infra/firestore";
import type { IPagination } from "../entities/pagination";
import type { IProduct } from "../entities/product";
import type { IProductRepository } from "./product-repository.interface";

export class ProductRepository implements IProductRepository {
	private getCollection(listId: string) {
		return db.collection("lists").doc(listId).collection("items");
	}

	async findAll(
		page: number,
		limit: number,
		listId: string,
	): Promise<IPagination> {
		const querySnapshot = await this.getCollection(listId).get();
		const allItems: IProduct[] = [];

		for (const doc of querySnapshot.docs) {
			allItems.push({ id: doc.id, ...doc.data() } as IProduct);
		}

		const total = allItems.length;
		const start = (page - 1) * limit;
		const end = start + limit;
		const data = allItems.slice(start, end);

		return {
			data,
			total,
			totalPages: Math.ceil(total / limit),
			currentPage: page,
		};
	}

	async create(data: IProduct): Promise<IProduct> {
		const docRef = await this.getCollection(data.listId).add(data);
		return { ...data, id: docRef.id };
	}

	async findById(id: string, listId: string): Promise<IProduct | null> {
		const docSnap = await this.getCollection(listId).doc(id).get();
		if (docSnap.exists) {
			return { id: docSnap.id, ...docSnap.data() } as IProduct;
		}
		return null;
	}

	async toggleProductChecked(
		id: string,
		listId: string,
		checked: boolean,
	): Promise<void> {
		await this.getCollection(listId).doc(id).update({ checked });
	}

	async delete(id: string, listId: string): Promise<void> {
		await this.getCollection(listId).doc(id).delete();
	}
}
