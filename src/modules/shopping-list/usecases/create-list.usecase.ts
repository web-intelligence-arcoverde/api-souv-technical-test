import { db } from "../../../infra/firestore";
import {
	SHOPPING_LIST_JOBS,
	shoppingListQueue,
} from "../../../infra/queue/shopping-list.queue";
import type { IProduct } from "../../product/entities/product";
import type { IShoppingList } from "../entities/shopping-list";

export interface CreateListDTO {
	title: string;
	description?: string;
	category: string;
	variant: "primary" | "secondary" | "tertiary";
	totalItems?: number;
	securedItems?: number;
	items?: (Omit<IProduct, "listId"> & { listId?: string })[];
	userId: string;
}

export class CreateListUseCase {
	async execute(data: CreateListDTO): Promise<IShoppingList> {
		const id = db.collection("lists").doc().id;

		const newList: IShoppingList = {
			id,
			title: data.title,
			description: data.description || "",
			category: data.category,
			variant: data.variant,
			totalItems: data.totalItems || 0,
			securedItems: data.securedItems || 0,
			items: (data.items || []).map((item) => ({
				...item,
				listId: id,
			})) as IProduct[],
			ownerId: data.userId,
			lastModified: new Date(),
		};

		// Enfileira a criação
		await shoppingListQueue.add(SHOPPING_LIST_JOBS.CREATE_LIST, {
			...data,
			items: newList.items, // Pass the items with assigned listId
			id,
		});

		return newList;
	}
}
