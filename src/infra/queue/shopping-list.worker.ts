import { type Job, Worker } from "bullmq";
import * as admin from "firebase-admin";
import type { IProduct } from "../../modules/product/entities/product";
import { ProductRepository } from "../../modules/product/repositories/product-repository";
import { ShoppingListRepository } from "../../modules/shopping-list/repositories/shopping-list.repository";
import type { CreateListDTO } from "../../modules/shopping-list/usecases/create-list.usecase";
import { invalidateCacheByPattern } from "../cache/redis.helper";
import logger from "../logger/logger";
import { queueRedisConnection } from "./queue.config";
import { SHOPPING_LIST_JOBS } from "./shopping-list.queue";

const listRepository = new ShoppingListRepository();
const productRepository = new ProductRepository();

export const shoppingListProcessor = async (job: Job) => {
	logger.info(
		`[ShoppingListQueue] Processing job ${job.id} of type ${job.name}`,
	);

	try {
		switch (job.name) {
			case SHOPPING_LIST_JOBS.CREATE_LIST: {
				const data = job.data as CreateListDTO & { id: string };
				await listRepository.create({
					id: data.id,
					title: data.title,
					description: data.description || "",
					category: data.category,
					variant: data.variant,
					totalItems: data.totalItems || 0,
					securedItems: data.securedItems || 0,
					items: (data.items || []) as IProduct[],
					ownerId: data.userId,
					lastModified: new Date(),
				});

				// Invalida a listagem do usuário
				await invalidateCacheByPattern(`lists:user:${data.userId}:*`);
				break;
			}

			case SHOPPING_LIST_JOBS.ADD_PRODUCT: {
				const { listId, productData } = job.data as {
					listId: string;
					productData: IProduct;
				};

				// Persist the product
				await productRepository.create(productData);

				// Update the list count atoms
				await listRepository.update(listId, {
					// biome-ignore lint/suspicious/noExplicitAny: Atomic increment
					totalItems: admin.firestore.FieldValue.increment(1) as any,
					lastModified: new Date(),
				});

				// Invalida detalhes e compartilhamento da lista
				await invalidateCacheByPattern(`list:detail:${listId}:*`);
				await invalidateCacheByPattern(`list:shared:${listId}`);
				break;
			}

			default:
				logger.warn(`[ShoppingListQueue] Unknown job type: ${job.name}`);
		}
	} catch (error) {
		logger.error(`[ShoppingListQueue] Error processing job ${job.id}:`, error);
		throw error;
	}
};

export const shoppingListWorker = new Worker(
	"shopping-list-queue",
	shoppingListProcessor,
	{
		connection: queueRedisConnection,
		concurrency: 5,
	},
);

shoppingListWorker.on("completed", (job) => {
	logger.info(`[ShoppingListQueue] Job ${job.id} completed successfully`);
});

shoppingListWorker.on("failed", (job, err) => {
	logger.error(`[ShoppingListQueue] Job ${job?.id} failed: ${err.message}`);
});
