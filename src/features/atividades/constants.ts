// `subject` não é dado de referência do backend (sem GET /disciplinas —
// docs/API.md §9.1) nem é persistido; é só para UX do formulário, então uma
// lista estática é suficiente (tarefas_tecnicas_frontend.md, Épico FE-5,
// tarefa 1).
export const DISCIPLINAS = [
  "Língua Portuguesa",
  "Matemática",
  "Ciências",
  "História",
  "Geografia",
  "Arte",
  "Inglês",
  "Educação Física",
] as const;
