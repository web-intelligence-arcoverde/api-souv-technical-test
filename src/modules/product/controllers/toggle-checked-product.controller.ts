import type { RequestHandler } from "express";
import { z } from "zod";
import type { IUseCase } from "../usecases/usecase.interface";
import { toggleCheckedProductValidation } from "../validations/toggle-checked-product.schema";
import type { IController } from "./controller.interface";

export class ToggleCheckedProductController implements IController {
	constructor(private readonly useCase: IUseCase) {}

	handle: RequestHandler = async (req, res, next) => {
		try {
			const validated = toggleCheckedProductValidation.parse({
				id: req.params.id,
				checked: req.body.checked,
			});

			const result = await this.useCase.execute(validated);

			res.status(200).json({ message: "Product updated successfully", result });
		} catch (err) {
			if (err instanceof z.ZodError) {
				res.status(400).json({ error: "Invalid input", issues: err.issues });
				return;
			}
			next(err);
		}
	};
}
