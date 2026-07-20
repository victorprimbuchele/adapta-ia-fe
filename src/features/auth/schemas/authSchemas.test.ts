import { loginSchema, registerSchema } from "./authSchemas";

describe("loginSchema", () => {
  it("aceita e-mail e senha válidos", () => {
    const result = loginSchema.safeParse({ email: "prof@escola.com", password: "qualquercoisa" });
    expect(result.success).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    const result = loginSchema.safeParse({ email: "nao-e-email", password: "qualquercoisa" });
    expect(result.success).toBe(false);
  });

  it("rejeita senha vazia", () => {
    const result = loginSchema.safeParse({ email: "prof@escola.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const base = {
    name: "Prof. Maria",
    email: "maria@escola.com",
    password: "Senha123",
    confirmPassword: "Senha123",
  };

  it("aceita dados válidos", () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });

  it("rejeita nome muito curto", () => {
    const result = registerSchema.safeParse({ ...base, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    const result = registerSchema.safeParse({ ...base, email: "invalido" });
    expect(result.success).toBe(false);
  });

  it("rejeita senha sem letra maiúscula", () => {
    const result = registerSchema.safeParse({ ...base, password: "senha123", confirmPassword: "senha123" });
    expect(result.success).toBe(false);
  });

  it("rejeita senha sem dígito", () => {
    const result = registerSchema.safeParse({ ...base, password: "SenhaSenha", confirmPassword: "SenhaSenha" });
    expect(result.success).toBe(false);
  });

  it("rejeita senha curta (menos de 8 caracteres)", () => {
    const result = registerSchema.safeParse({ ...base, password: "Se1aSe1", confirmPassword: "Se1aSe1" });
    expect(result.success).toBe(false);
  });

  it("rejeita quando a confirmação diverge da senha", () => {
    const result = registerSchema.safeParse({ ...base, confirmPassword: "Outra123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path.join("."));
      expect(paths).toContain("confirmPassword");
    }
  });
});
