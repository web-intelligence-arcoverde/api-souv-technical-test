import { z } from "zod";

export const updateAccountSchema = z.object({
	name: z
		.string()
		.min(2, "O nome deve ter pelo menos 2 caracteres.")
		.optional(),
	email: z.string().email("E-mail inválido.").optional(),
});
