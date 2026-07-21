import { alunoSchema } from "./alunoSchemas";

describe("alunoSchema", () => {
  const base = { name: "Lucas Mendes", email: "lucas@escola.com", learningProfileId: "profile-1" };

  it("aceita dados válidos", () => {
    expect(alunoSchema.safeParse(base).success).toBe(true);
  });

  it("rejeita nome muito curto", () => {
    expect(alunoSchema.safeParse({ ...base, name: "A" }).success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    expect(alunoSchema.safeParse({ ...base, email: "nao-e-email" }).success).toBe(false);
  });

  it("rejeita quando nenhum perfil foi selecionado", () => {
    expect(alunoSchema.safeParse({ ...base, learningProfileId: "" }).success).toBe(false);
  });
});
