import type { RequestHandler } from "express";
import { z } from "zod";
import type { CreateListUseCase } from "../usecases/create-list.usecase";
import type { ListListsUseCase } from "../usecases/list-lists.usecase";
import { createListSchema } from "../validations/create-list.schema";

export class ShoppingListController {
	constructor(
		private readonly createListUseCase: CreateListUseCase,
		private readonly listListsUseCase: ListListsUseCase,
	) {}

	create: RequestHandler = async (req, res, next) => {
		try {
			const data = createListSchema.parse(req.body);
			const result = await this.createListUseCase.execute(data);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	};

	list: RequestHandler = async (req, res, next) => {
		try {
			const { userId } = req.query;
			const validatedUserId = z
				.string()
				.min(1, "userId is required")
				.parse(userId);
			const result = await this.listListsUseCase.execute(validatedUserId);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};
}
