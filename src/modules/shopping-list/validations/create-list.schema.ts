import { z } from "zod";

export const createListSchema = z.object({
	name: z.string().min(1, "O nome da lista é obrigatório."),
	userId: z.string().min(1, "O ID do usuário é obrigatório."),
});
