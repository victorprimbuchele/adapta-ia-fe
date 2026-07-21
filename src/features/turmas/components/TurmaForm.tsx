import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, FormAlert } from "../../../components/shared/FormError";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select } from "../../../components/ui/select";
import { useEscolas } from "../hooks/useEscolas";
import { useSeries } from "../hooks/useSeries";
import { turmaSchema, type TurmaFormValues } from "../schemas/turmaSchemas";

export interface TurmaFormProps {
  defaultValues: TurmaFormValues;
  onSubmit: (values: TurmaFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  errorMessage?: string | null;
}

// Formulário compartilhado entre criação e edição de turma (mesmo padrão
// de AlunoForm): evita duplicar campos/validação entre TurmaNovaScreen e
// TurmaEditarScreen.
export function TurmaForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  submittingLabel,
  errorMessage,
}: TurmaFormProps) {
  const { data: escolas, isPending: isEscolasPending } = useEscolas();
  const { data: series, isPending: isSeriesPending } = useSeries();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TurmaFormValues>({
    resolver: zodResolver(turmaSchema),
    mode: "onChange",
    defaultValues,
  });

  const referenceDataLoading = isEscolasPending || isSeriesPending;

  return (
    <div className="space-y-5">
      <FormAlert message={errorMessage} />

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <Label htmlFor="name">Nome da turma</Label>
          <Input id="name" placeholder="Ex: 6º Ano A" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="gradeId">Série</Label>
          <Select id="gradeId" disabled={isSeriesPending} {...register("gradeId")}>
            <option value="">{isSeriesPending ? "Carregando séries..." : "Selecione a série"}</option>
            {series?.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </Select>
          <FieldError message={errors.gradeId?.message} />
        </div>

        <div>
          <Label htmlFor="schoolName">Escola</Label>
          <Select id="schoolName" disabled={isEscolasPending} {...register("schoolName")}>
            <option value="">{isEscolasPending ? "Carregando escolas..." : "Selecione a escola"}</option>
            {escolas?.map((school) => (
              <option key={school.id} value={school.name}>
                {school.name}
              </option>
            ))}
          </Select>
          <FieldError message={errors.schoolName?.message} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
            disabled={!isValid || referenceDataLoading || isSubmitting}
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
