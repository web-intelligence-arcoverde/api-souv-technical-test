import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import type { IUseCase } from "../usecases/usecase.interface";
import { listProductValidation } from "../validations/list-product.schema";
import type { IController } from "./controller.interface";

export class ListProductController implements IController {
	constructor(private readonly useCase: IUseCase) {}

	async handle(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response> {
		try {
			const data = listProductValidation.parse(req.query);
			const result = await this.useCase.execute(data);
			return res.status(200).json(result);
		} catch (err) {
			if (err instanceof z.ZodError) {
				return res
					.status(400)
					.json({ error: "Invalid input", issues: err.issues });
			}
			next(err);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
}
