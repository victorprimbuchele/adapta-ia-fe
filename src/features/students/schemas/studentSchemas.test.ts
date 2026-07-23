import { studentSchema } from "./studentSchemas";

describe("studentSchema", () => {
  const base = { name: "Lucas Mendes", email: "lucas@escola.com", learningProfileId: "profile-1" };

  it("aceita dados válidos", () => {
    expect(studentSchema.safeParse(base).success).toBe(true);
  });

  it("rejeita nome muito curto", () => {
    expect(studentSchema.safeParse({ ...base, name: "A" }).success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    expect(studentSchema.safeParse({ ...base, email: "nao-e-email" }).success).toBe(false);
  });

  it("rejeita quando nenhum perfil foi selecionado", () => {
    expect(studentSchema.safeParse({ ...base, learningProfileId: "" }).success).toBe(false);
  });
});
