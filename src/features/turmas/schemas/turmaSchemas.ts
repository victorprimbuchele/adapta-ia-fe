import { z } from "zod";

// Regras espelham o backend (docs/API.md §6.4): name trim 2-120,
// schoolId/gradeId de itens existentes (selects populados via API).
export const turmaSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto.").max(120, "Nome muito longo."),
  schoolId: z.string().trim().min(1, "Selecione a escola."),
  gradeId: z.string().trim().min(1, "Selecione a série."),
});

export type TurmaFormValues = z.infer<typeof turmaSchema>;
