import { z } from "zod";

export const createProductSchema = z.object({
	category: z.string().min(1, "A categoria é obrigatória."),
	name: z.string().min(1, "O nome é obrigatório."),
	quantity: z
		.number()
		.int()
		.positive("A quantidade deve ser um número inteiro positivo."),
	unit: z.string().min(1, "A unidade é obrigatória."),
	checked: z.boolean().optional(),
});
