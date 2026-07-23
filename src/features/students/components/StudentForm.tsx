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
import { studentSchema, type StudentFormValues } from "../schemas/studentSchemas";

export interface StudentFormProps {
  defaultValues: StudentFormValues;
  learningProfiles: LearningProfile[] | undefined;
  isLearningProfilesPending: boolean;
  onSubmit: (values: StudentFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  errorMessage: string | null;
}

// Form compartilhado entre cadastro (StudentNewScreen) e edição
// (StudentEditScreen) de aluno — mesmos campos, mesma validação.
export function StudentForm({
  defaultValues,
  learningProfiles,
  isLearningProfilesPending,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  submittingLabel,
  errorMessage,
}: StudentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
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
          <span id="learning-profile-label" className="block text-sm font-semibold text-ink mb-1.5">
            Perfil de aprendizagem
          </span>
          {isLearningProfilesPending ? (
            <div className="space-y-3 mt-1">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <Controller
              name="learningProfileId"
              control={control}
              render={({ field }) => (
                <div
                  role="radiogroup"
                  aria-labelledby="learning-profile-label"
                  aria-describedby={errors.learningProfileId ? "learning-profile-error" : undefined}
                  className="space-y-3 mt-1"
                >
                  {learningProfiles?.map((profile) => {
                    const active = field.value === profile.id;
                    const code = getProfileCode(profile);
                    return (
                      <button
                        key={profile.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => field.onChange(profile.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          active ? "border-brand bg-brand/5" : "border-border-soft hover:border-brand/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-sm text-ink">
                              {code ? `${code} · ` : ""}
                              {profile.name}
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
          <FieldError id="learning-profile-error" message={errors.learningProfileId?.message} />
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
            disabled={!isValid || isLearningProfilesPending || isSubmitting}
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </>
  );
}
