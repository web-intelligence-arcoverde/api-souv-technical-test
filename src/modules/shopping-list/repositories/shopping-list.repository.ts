import type * as admin from "firebase-admin";
import { db } from "../../../infra/firestore";
import type { IShoppingList } from "../entities/shopping-list";
import type {
	IShoppingListRepository,
	ListListsFilters,
} from "./shopping-list.repository.interface";

export class ShoppingListRepository implements IShoppingListRepository {
	private readonly collectionName = "shopping-lists";

	async create(data: IShoppingList): Promise<IShoppingList> {
		const listRef = data.id
			? db.collection(this.collectionName).doc(data.id)
			: db.collection(this.collectionName).doc();

		const id = listRef.id;

		await listRef.set({
			...data,
			id,
			createdAt: new Date(),
		});

		return { ...data, id };
	}

	async findAllByUserId(
		userId: string,
		limit?: number,
		offset?: number,
	): Promise<IShoppingList[]> {
		return this.findAll({ ownerId: userId }, limit, offset);
	}

	async findAll(
		filters: ListListsFilters,
		limit?: number,
		offset?: number,
	): Promise<IShoppingList[]> {
		let query: admin.firestore.Query = db.collection(this.collectionName);

		if (filters.ownerId) {
			query = query.where("ownerId", "==", filters.ownerId);
		}

		if (filters.category) {
			query = query.where("category", "==", filters.category);
		}

		if (filters.shared !== undefined) {
			query = query.where("shared", "==", filters.shared);
		}

		if (filters.variant) {
			query = query.where("variant", "==", filters.variant);
		}

		if (limit !== undefined) {
			query = query.limit(limit);
		}

		if (offset !== undefined) {
			query = query.offset(offset);
		}

		const querySnapshot = await query.get();

		const fetchPromises = querySnapshot.docs.map(
			async (doc: admin.firestore.QueryDocumentSnapshot) => {
				const listData = doc.data() as IShoppingList;
				const items = await this.getItems(doc.id);
				return { id: doc.id, ...listData, items } as IShoppingList;
			},
		);

		return Promise.all(fetchPromises);
	}

	async findById(id: string): Promise<IShoppingList | null> {
		const trimmedId = id.trim();
		const docSnap = await db
			.collection(this.collectionName)
			.doc(trimmedId)
			.get();

		if (docSnap.exists) {
			const listData = docSnap.data() as IShoppingList;
			const items = await this.getItems(trimmedId);
			return { id: docSnap.id, ...listData, items } as IShoppingList;
		}

		return null;
	}

	private async getItems(listId: string) {
		const trimmedId = listId.trim();
		const itemsSnapshot = await db
			.collection("products")
			.where("listId", "==", trimmedId)
			.get();

		return itemsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
	}

	async update(id: string, data: Partial<IShoppingList>): Promise<void> {
		await db.collection(this.collectionName).doc(id).update(data);
	}

	async delete(id: string): Promise<void> {
		const itemsSnapshot = await db
			.collection("products")
			.where("listId", "==", id)
			.get();

		const batch = db.batch();

		// Deletar todos os itens da coleção products vinculados a esta lista
		for (const itemDoc of itemsSnapshot.docs) {
			batch.delete(itemDoc.ref);
		}

		// Deletar a lista principal
		const listRef = db.collection(this.collectionName).doc(id);
		batch.delete(listRef);

		await batch.commit();
	}
}
