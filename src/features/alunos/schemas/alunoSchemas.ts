import { z } from "zod";

// Regras espelham o backend (docs/API.md §6.4/§6.6): name trim 2-120,
// email válido. Perfil é single-select (Épico FE-4, tarefa 3) — nunca
// múltiplos valores.
export const alunoSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto.").max(120, "Nome muito longo."),
  email: z.string().trim().min(1, "Informe o e-mail.").email("E-mail inválido."),
  learningProfileId: z.string().trim().min(1, "Selecione um perfil de aprendizagem."),
});

export type AlunoFormValues = z.infer<typeof alunoSchema>;
