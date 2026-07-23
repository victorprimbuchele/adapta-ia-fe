import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brain } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { PasswordInput } from "../../../components/ui/password-input";
import { BackBtn } from "../../../components/shared/BackBtn";
import { FieldError, FormAlert } from "../../../components/shared/FormError";
import { useAuth } from "../hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "../schemas/authSchemas";

// Campo "Escola" removido do escopo (ver docs/tarefas_tecnicas_frontend.md):
// School só se relaciona com Class, o professor não informa escola no
// próprio cadastro.
export function RegisterScreen() {
  const navigate = useNavigate();
  const { register: registerProfessor, isSubmitting, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-soft font-sans">
      <div className="w-full max-w-[480px]">
        <div className="flex items-center gap-2.5 mb-8">
          <Brain className="w-7 h-7 text-brand" />
          <span className="text-2xl font-bold text-ink font-heading">Adapta.ai</span>
        </div>

        <Card className="p-8 shadow-sm">
          <BackBtn onClick={() => navigate("/login")} />
          <h2 className="text-2xl font-bold text-ink mb-1 font-heading">Criar conta</h2>
          <p className="text-muted text-sm mb-7">Cadastre-se como professor</p>

          <FormAlert message={error} />

          <form className="space-y-4" onSubmit={handleSubmit(registerProfessor)} noValidate>
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" placeholder="Prof. Maria da Silva" autoComplete="name" {...register("name")} />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <Label htmlFor="email">E-mail institucional</Label>
              <Input
                id="email"
                type="email"
                placeholder="maria@escola.edu.br"
                autoComplete="email"
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <PasswordInput
                id="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                {...register("password")}
              />
              <FieldError message={errors.password?.message} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Repita a senha"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              <FieldError message={errors.confirmPassword?.message} />
            </div>
            <Button
              type="submit"
              className="w-full mt-1"
              isLoading={isSubmitting}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Criando conta..." : "Criar minha conta"}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border-soft text-center">
            <span className="text-muted text-sm">Já tem conta? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-brand font-bold text-sm hover:underline"
            >
              Entrar
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
