import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, FormAlert } from "../../../components/shared/FormError";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select } from "../../../components/ui/select";
import { useSchools } from "../hooks/useSchools";
import { useGrades } from "../hooks/useGrades";
import { classSchema, type ClassFormValues } from "../schemas/classSchemas";

export interface ClassFormProps {
  defaultValues: ClassFormValues;
  onSubmit: (values: ClassFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  errorMessage?: string | null;
}

// Formulário compartilhado entre criação e edição de turma (mesmo padrão
// de StudentForm): evita duplicar campos/validação entre ClassNewScreen e
// ClassEditScreen.
export function ClassForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  submittingLabel,
  errorMessage,
}: ClassFormProps) {
  const { data: schools, isPending: isSchoolsPending } = useSchools();
  const { data: grades, isPending: isGradesPending } = useGrades();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    mode: "onChange",
    defaultValues,
  });

  const referenceDataLoading = isSchoolsPending || isGradesPending;

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
          <Select id="gradeId" disabled={isGradesPending} {...register("gradeId")}>
            <option value="">{isGradesPending ? "Carregando séries..." : "Selecione a série"}</option>
            {grades?.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </Select>
          <FieldError message={errors.gradeId?.message} />
        </div>

        <div>
          <Label htmlFor="schoolName">Escola</Label>
          <Select id="schoolName" disabled={isSchoolsPending} {...register("schoolName")}>
            <option value="">{isSchoolsPending ? "Carregando escolas..." : "Selecione a escola"}</option>
            {schools?.map((school) => (
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
