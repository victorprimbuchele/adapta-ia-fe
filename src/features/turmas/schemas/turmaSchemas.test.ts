import { turmaSchema } from "./turmaSchemas";

describe("turmaSchema", () => {
  const base = { name: "6º Ano A", schoolId: "school-1", gradeId: "grade-1" };

  it("aceita dados válidos", () => {
    expect(turmaSchema.safeParse(base).success).toBe(true);
  });

  it("rejeita nome muito curto", () => {
    expect(turmaSchema.safeParse({ ...base, name: "A" }).success).toBe(false);
  });

  it("rejeita quando a escola não foi selecionada", () => {
    expect(turmaSchema.safeParse({ ...base, schoolId: "" }).success).toBe(false);
  });

  it("rejeita quando a série não foi selecionada", () => {
    expect(turmaSchema.safeParse({ ...base, gradeId: "" }).success).toBe(false);
  });
});
