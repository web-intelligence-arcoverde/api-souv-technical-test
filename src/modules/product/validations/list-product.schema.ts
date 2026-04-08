import { z } from "zod";

export const listProductValidation = z.object({
	limit: z.string().regex(/^\d+$/).transform(Number),
	page: z.string().regex(/^\d+$/).transform(Number),
});
