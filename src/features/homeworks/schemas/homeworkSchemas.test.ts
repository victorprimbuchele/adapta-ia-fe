import { homeworkSchema } from "./homeworkSchemas";

describe("homeworkSchema", () => {
  const base = {
    title: "Interpretação — Capítulo 3",
    subject: "Língua Portuguesa",
    classId: "turma-1",
    content: "Texto principal da atividade.",
    question: "1. O que o texto quer dizer?",
  };

  it("aceita dados válidos", () => {
    expect(homeworkSchema.safeParse(base).success).toBe(true);
  });

  it("rejeita título muito curto", () => {
    expect(homeworkSchema.safeParse({ ...base, title: "A" }).success).toBe(false);
  });

  it("rejeita quando a disciplina não foi selecionada", () => {
    expect(homeworkSchema.safeParse({ ...base, subject: "" }).success).toBe(false);
  });

  it("rejeita quando a turma não foi selecionada", () => {
    expect(homeworkSchema.safeParse({ ...base, classId: "" }).success).toBe(false);
  });

  it("rejeita conteúdo vazio", () => {
    expect(homeworkSchema.safeParse({ ...base, content: "" }).success).toBe(false);
  });

  it("rejeita questões vazias", () => {
    expect(homeworkSchema.safeParse({ ...base, question: "" }).success).toBe(false);
  });
});
