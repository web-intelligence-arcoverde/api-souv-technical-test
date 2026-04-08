import { z } from "zod";

export const deleteProductValidation = z.object({
	id: z.string().regex(/^\d+$/).transform(Number),
});
