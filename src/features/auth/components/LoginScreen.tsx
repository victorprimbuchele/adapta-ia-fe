import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brain, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { PasswordInput } from "../../../components/ui/password-input";
import { Card } from "../../../components/ui/card";
import { FieldError, FormAlert } from "../../../components/shared/FormError";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../schemas/authSchemas";

const HIGHLIGHTS = [
  "A IA gera versões personalizadas por perfil de aprendizagem",
  "Envio automático em PDF por e-mail para cada aluno",
  "Interface simples como o WhatsApp — curva zero",
];

export function LoginScreen() {
  const { login, isSubmitting, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex lg:w-[46%] bg-gradient-to-br from-[#0D4030] via-brand to-[#1A5480] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white font-heading">Adapta.ai</span>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-8 font-heading">
            Atividades adaptadas para cada aluno, sem esforço extra.
          </h1>
          <div className="space-y-4">
            {HIGHLIGHTS.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#6EE7B7] flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/30 text-xs">© 2026 Adapta.ai — Educação inclusiva para todos</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-bg-soft">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <Brain className="w-7 h-7 text-brand" />
            <span className="text-2xl font-bold text-ink font-heading">Adapta.ai</span>
          </div>

          <Card className="p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-ink mb-1 font-heading">Entrar</h2>
            <p className="text-muted text-sm mb-7">Acesse sua conta de professor</p>

            <FormAlert message={error} />

            <form className="space-y-4" onSubmit={handleSubmit(login)} noValidate>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" autoComplete="email" {...register("email")} />
                <FieldError message={errors.email?.message} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="password" className="mb-0">
                    Senha
                  </Label>
                  <button type="button" className="text-xs text-brand hover:underline font-medium">
                    Esqueci minha senha
                  </button>
                </div>
                <PasswordInput id="password" autoComplete="current-password" {...register("password")} />
                <FieldError message={errors.password?.message} />
              </div>
              <Button
                type="submit"
                className="w-full mt-2"
                isLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? "Entrando..." : "Entrar na plataforma"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border-soft text-center">
              <span className="text-muted text-sm">Ainda não tem conta? </span>
              <Link to="/register" className="text-brand font-bold text-sm hover:underline">
                Cadastre-se gratuitamente
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
