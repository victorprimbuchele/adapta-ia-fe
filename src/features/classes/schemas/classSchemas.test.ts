import { classSchema } from "./classSchemas";

describe("classSchema", () => {
  const base = { name: "6º Ano A", schoolName: "Escola Teste", gradeId: "grade-1" };

  it("aceita dados válidos", () => {
    expect(classSchema.safeParse(base).success).toBe(true);
  });

  it("rejeita nome muito curto", () => {
    expect(classSchema.safeParse({ ...base, name: "A" }).success).toBe(false);
  });

  it("rejeita quando a escola não foi selecionada", () => {
    expect(classSchema.safeParse({ ...base, schoolName: "" }).success).toBe(false);
  });

  it("rejeita quando a série não foi selecionada", () => {
    expect(classSchema.safeParse({ ...base, gradeId: "" }).success).toBe(false);
  });
});
