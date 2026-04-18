import { db } from "../../../infra/firestore";
import type { IPagination } from "../entities/pagination";
import type { IProduct } from "../entities/product";
import type { IProductRepository } from "./product-repository.interface";

export class ProductRepository implements IProductRepository {
	private readonly collectionName = "products";

	private getCollection() {
		return db.collection(this.collectionName);
	}

	async findAll(
		page: number,
		limit: number,
		listId: string,
	): Promise<IPagination> {
		const querySnapshot = await this.getCollection()
			.where("listId", "==", listId)
			.get();

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
		const itemRef =
			data.id && typeof data.id === "string"
				? this.getCollection().doc(data.id)
				: this.getCollection().doc();

		const id = itemRef.id;

		await itemRef.set({
			...data,
			id,
		});

		return { ...data, id };
	}

	async findById(id: string): Promise<IProduct | null> {
		const docSnap = await this.getCollection().doc(id).get();
		if (docSnap.exists) {
			return { id: docSnap.id, ...docSnap.data() } as IProduct;
		}
		return null;
	}

	async toggleProductChecked(id: string, checked: boolean): Promise<void> {
		await this.getCollection().doc(id).update({ checked });
	}

	async delete(id: string): Promise<void> {
		await this.getCollection().doc(id).delete();
	}
}
