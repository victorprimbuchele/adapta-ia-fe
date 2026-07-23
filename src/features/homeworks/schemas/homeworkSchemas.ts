import { z } from "zod";

// Regras espelham o backend (docs/API.md §6.6, POST /homeworks). `question`
// e `subject` são validados aqui e enviados ao backend, mas não são
// persistidos (lacuna conhecida) — mantidos localmente só para UX do
// formulário (tarefas_tecnicas_frontend.md, Épico FE-5, tarefa 3).
export const homeworkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Título deve ter pelo menos 2 caracteres.")
    .max(200, "Título deve ter no máximo 200 caracteres."),
  subject: z.string().trim().min(2, "Selecione a disciplina.").max(120, "Disciplina muito longa."),
  classId: z.string().trim().min(1, "Selecione a turma."),
  content: z
    .string()
    .trim()
    .min(1, "Informe o conteúdo principal.")
    .max(50000, "Conteúdo muito longo."),
  question: z
    .string()
    .trim()
    .min(1, "Informe as questões.")
    .max(10000, "Questões muito longas."),
});

export type HomeworkFormValues = z.infer<typeof homeworkSchema>;
