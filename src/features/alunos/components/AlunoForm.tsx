import { CheckCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, FormAlert } from "../../../components/shared/FormError";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Skeleton } from "../../../components/ui/skeleton";
import { getProfileCode } from "../../../lib/learningProfilePrompt";
import type { LearningProfile } from "../../../types/class";
import { alunoSchema, type AlunoFormValues } from "../schemas/alunoSchemas";

export interface AlunoFormProps {
  defaultValues: AlunoFormValues;
  perfis: LearningProfile[] | undefined;
  isPerfisPending: boolean;
  onSubmit: (values: AlunoFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  errorMessage: string | null;
}

// Form compartilhado entre cadastro (AlunoNovoScreen) e edição
// (AlunoEditarScreen) de aluno — mesmos campos, mesma validação.
export function AlunoForm({
  defaultValues,
  perfis,
  isPerfisPending,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  submittingLabel,
  errorMessage,
}: AlunoFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<AlunoFormValues>({
    resolver: zodResolver(alunoSchema),
    mode: "onChange",
    defaultValues,
  });

  return (
    <>
      <FormAlert message={errorMessage} />

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" placeholder="Nome do aluno" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="aluno@escola.edu.br"
            autoComplete="email"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label>Perfil de aprendizagem</Label>
          {isPerfisPending ? (
            <div className="space-y-3 mt-1">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <Controller
              name="learningProfileId"
              control={control}
              render={({ field }) => (
                <div className="space-y-3 mt-1">
                  {perfis?.map((perfil) => {
                    const active = field.value === perfil.id;
                    const code = getProfileCode(perfil);
                    return (
                      <button
                        key={perfil.id}
                        type="button"
                        onClick={() => field.onChange(perfil.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          active ? "border-brand bg-brand/5" : "border-border-soft hover:border-brand/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-sm text-ink">
                              {code ? `${code} · ` : ""}
                              {perfil.name}
                            </p>
                          </div>
                          {active && <CheckCircle className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          )}
          <FieldError message={errors.learningProfileId?.message} />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-border-input text-ink text-sm font-bold hover:bg-bg-soft transition-colors"
          >
            Cancelar
          </button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={isSubmitting}
            disabled={!isValid || isPerfisPending || isSubmitting}
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </>
  );
}
