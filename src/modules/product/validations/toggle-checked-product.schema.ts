import { z } from "zod";

export const toggleCheckedProductValidation = z.object({
	id: z.string().regex(/^\d+$/).transform(Number), // vem da URL como string
	checked: z.boolean(),
});
