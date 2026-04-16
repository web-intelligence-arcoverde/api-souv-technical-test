import type { Request, RequestHandler } from "express";
import logger from "../../../infra/logger/logger";

import type { CreateListUseCase } from "../usecases/create-list.usecase";
import type { DeleteListUseCase } from "../usecases/delete-list.usecase";
import type { GetListUseCase } from "../usecases/get-list.usecase";
import type { ListListsFilteredUseCase } from "../usecases/list-lists-filtered.usecase";
import type { UpdateListUseCase } from "../usecases/update-list.usecase";
import { createListSchema } from "../validations/create-list.schema";
import { updateListSchema } from "../validations/update-list.schema";

interface AuthenticatedRequest extends Request {
	user: {
		uid: string;
		email: string;
	};
}

export class ShoppingListController {
	constructor(
		private readonly createListUseCase: CreateListUseCase,
		private readonly listListsUseCase: ListListsFilteredUseCase,
		private readonly getListUseCase: GetListUseCase,
		private readonly updateListUseCase: UpdateListUseCase,
		private readonly deleteListUseCase: DeleteListUseCase,
	) {}

	create: RequestHandler = async (req, res, next) => {
		try {
			const data = createListSchema.parse(req.body);
			const result = await this.createListUseCase.execute({
				...data,
				userId: (req as unknown as AuthenticatedRequest).user.uid,
			});
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	};

	list: RequestHandler = async (req, res, next) => {
		try {
			const userId = (req as unknown as AuthenticatedRequest).user.uid;
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 10;
			const category = req.query.category as string;
			const shared =
				req.query.shared === "true"
					? true
					: req.query.shared === "false"
						? false
						: undefined;
			const variant = req.query.variant as string;

			const result = await this.listListsUseCase.execute({
				userId,
				page,
				limit,
				category,
				shared,
				variant,
			});
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};

	getById: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params;

			logger.info(`[ShoppingListController] Fetching list by ID: "${id}"`);

			const result = await this.getListUseCase.execute(id);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};

	update: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params;
			const data = updateListSchema.parse(req.body);
			await this.updateListUseCase.execute(id, data);
			res.status(200).json({ message: "Lista atualizada com sucesso" });
		} catch (error) {
			next(error);
		}
	};

	delete: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params;
			await this.deleteListUseCase.execute(id);
			res.status(200).json({ message: "Lista deletada com sucesso" });
		} catch (error) {
			next(error);
		}
	};
}
