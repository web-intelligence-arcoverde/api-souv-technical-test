import { db } from "../../../infra/firestore";
import type { IShoppingList } from "../entities/shopping-list";
import type { IShoppingListRepository } from "./shopping-list.repository.interface";

export class ShoppingListRepository implements IShoppingListRepository {
	private readonly collectionName = "lists";

	async create(data: IShoppingList): Promise<IShoppingList> {
		const docRef = await db.collection(this.collectionName).add({
			...data,
			createdAt: new Date(),
		});
		return { ...data, id: docRef.id };
	}

	async findAllByUserId(userId: string): Promise<IShoppingList[]> {
		const querySnapshot = await db
			.collection(this.collectionName)
			.where("ownerId", "==", userId)
			.get();

		const lists: IShoppingList[] = [];
		for (const doc of querySnapshot.docs) {
			lists.push({ id: doc.id, ...doc.data() } as IShoppingList);
		}
		return lists;
	}

	async findById(id: string): Promise<IShoppingList | null> {
		const docSnap = await db.collection(this.collectionName).doc(id).get();
		if (docSnap.exists) {
			return { id: docSnap.id, ...docSnap.data() } as IShoppingList;
		}
		return null;
	}

	async update(id: string, data: Partial<IShoppingList>): Promise<void> {
		await db.collection(this.collectionName).doc(id).update(data);
	}

	async delete(id: string): Promise<void> {
		await db.collection(this.collectionName).doc(id).delete();
	}
}
