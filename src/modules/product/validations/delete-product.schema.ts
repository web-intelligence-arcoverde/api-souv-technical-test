import { z } from "zod";

export const deleteProductValidation = z.object({
	id: z.string().min(1, "O ID do produto é obrigatório."),
});
