import { z } from "zod";

export const toggleCheckedProductValidation = z.object({
	id: z.string().min(1, "O ID do produto é obrigatório."),
	checked: z.boolean(),
});
