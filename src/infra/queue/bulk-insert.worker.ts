import { type Job, Worker } from "bullmq";
import * as admin from "firebase-admin";
import type { IProduct } from "../../modules/product/entities/product";
import { invalidateCacheByPattern } from "../cache/redis.helper";
import { db } from "../firestore";
import logger from "../logger/logger";
import { queueRedisConnection } from "./queue.config";

interface BulkInsertData {
	listId: string;
	items: IProduct[];
}

export const bulkInsertWorker = new Worker(
	"bulk-insert-products",
	async (job: Job<BulkInsertData>) => {
		const { listId, items } = job.data;

		logger.info(
			`[Queue] Processing job ${job.id}: inserting ${items.length} items in list ${listId}`,
		);

		const collectionRef = db
			.collection("lists")
			.doc(listId)
			.collection("items");

		// O Firestore permite no máximo 500 operações por batch
		const CHUNK_SIZE = 500;

		for (let i = 0; i < items.length; i += CHUNK_SIZE) {
			const chunk = items.slice(i, i + CHUNK_SIZE);
			const batch = db.batch();

			for (const item of chunk) {
				const docRef = collectionRef.doc(); // Gera um novo ID
				batch.set(docRef, item);
			}

			// Executa a transação para este chunk
			await batch.commit();
		}

		// Atualiza o contador de itens totais na lista pai
		await db
			.collection("lists")
			.doc(listId)
			.update({
				// biome-ignore lint/suspicious/noExplicitAny: Atomic increment
				totalItems: admin.firestore.FieldValue.increment(items.length) as any,
				lastModified: new Date(),
			});

		// Invalida cache de produtos e detalhes da lista
		await invalidateCacheByPattern(`products:page:*:list:${listId}`);
		await invalidateCacheByPattern(`list:detail:${listId}:*`);
		await invalidateCacheByPattern(`list:shared:${listId}`);

		logger.info(`[Queue] Job ${job.id} completed successfully!`);
	},
	{
		connection: queueRedisConnection,
		concurrency: 5, // Processa até 5 jobs simultaneamente (ajuste conforme necessário)
	},
);

// Lidar com erros do worker
bulkInsertWorker.on("failed", (job, err) => {
	logger.error(`[Queue] Job ${job?.id} failed: ${err.message}`);
});
