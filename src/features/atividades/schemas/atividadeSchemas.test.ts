import { atividadeSchema } from "./atividadeSchemas";

describe("atividadeSchema", () => {
  const base = {
    title: "Interpretação — Capítulo 3",
    subject: "Língua Portuguesa",
    classId: "turma-1",
    content: "Texto principal da atividade.",
    question: "1. O que o texto quer dizer?",
  };

  it("aceita dados válidos", () => {
    expect(atividadeSchema.safeParse(base).success).toBe(true);
  });

  it("rejeita título muito curto", () => {
    expect(atividadeSchema.safeParse({ ...base, title: "A" }).success).toBe(false);
  });

  it("rejeita quando a disciplina não foi selecionada", () => {
    expect(atividadeSchema.safeParse({ ...base, subject: "" }).success).toBe(false);
  });

  it("rejeita quando a turma não foi selecionada", () => {
    expect(atividadeSchema.safeParse({ ...base, classId: "" }).success).toBe(false);
  });

  it("rejeita conteúdo vazio", () => {
    expect(atividadeSchema.safeParse({ ...base, content: "" }).success).toBe(false);
  });

  it("rejeita questões vazias", () => {
    expect(atividadeSchema.safeParse({ ...base, question: "" }).success).toBe(false);
  });
});
