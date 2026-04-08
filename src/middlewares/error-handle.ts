import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	console.error(err);

	if (err instanceof ZodError) {
		res.status(400).json({
			error: "Validation Error",
			issues: err.issues.map((issue) => ({
				path: issue.path.join("."),
				message: issue.message,
			})),
		});
		return;
	}

	res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
