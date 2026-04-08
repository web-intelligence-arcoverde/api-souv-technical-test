import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import type { IUseCase } from "../usecases/usecase.interface";
import { toggleCheckedProductValidation } from "../validations/toggle-checked-product.schema";
import type { IController } from "./controller.interface";

export class ToggleCheckedProductController implements IController {
	constructor(private readonly useCase: IUseCase) {}

	async handle(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response> {
		try {
			const validated = toggleCheckedProductValidation.parse({
				id: req.params.id,
				checked: req.body.checked,
			});

			const result = await this.useCase.execute(validated);

			return res
				.status(200)
				.json({ message: "Product updated successfully", result });
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
