import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { FieldError, FormAlert } from "../../../components/shared/FormError";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select } from "../../../components/ui/select";
import { getApiErrorCode, getApiErrorMessage } from "../../../infra/http/apiClient";
import { useCreateTurma } from "../hooks/useCreateTurma";
import { useEscolas } from "../hooks/useEscolas";
import { useSeries } from "../hooks/useSeries";
import { turmaSchema, type TurmaFormValues } from "../schemas/turmaSchemas";

const ERROR_MESSAGES: Record<string, string> = {
  SCHOOL_NOT_FOUND: "A escola selecionada não foi encontrada.",
  GRADE_NOT_FOUND: "A série selecionada não foi encontrada.",
  TEACHER_NOT_FOUND: "Sua sessão parece inválida. Faça login novamente.",
};

export function TurmaNovaScreen() {
  const navigate = useNavigate();
  const { data: escolas, isPending: isEscolasPending } = useEscolas();
  const { data: series, isPending: isSeriesPending } = useSeries();
  const createTurma = useCreateTurma();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TurmaFormValues>({
    resolver: zodResolver(turmaSchema),
    mode: "onChange",
    defaultValues: { name: "", schoolId: "", gradeId: "" },
  });

  const onSubmit = handleSubmit((values) => {
    createTurma.mutate(values, {
      onSuccess: () => navigate("/turmas"),
    });
  });

  const referenceDataLoading = isEscolasPending || isSeriesPending;
  const errorMessage = createTurma.isError
    ? (ERROR_MESSAGES[getApiErrorCode(createTurma.error) ?? ""] ?? getApiErrorMessage(createTurma.error))
    : null;

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <BackBtn onClick={() => navigate("/turmas")} label="Turmas" />
        <h1 className="text-2xl font-bold text-ink mb-1 font-heading">Nova turma</h1>
        <p className="text-muted text-sm mb-8">Preencha os dados para criar a turma</p>

        <Card className="p-6 space-y-5">
          <FormAlert message={errorMessage} />

          <form className="space-y-5" onSubmit={onSubmit} noValidate>
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
              <Label htmlFor="schoolId">Escola</Label>
              <Select id="schoolId" disabled={isEscolasPending} {...register("schoolId")}>
                <option value="">{isEscolasPending ? "Carregando escolas..." : "Selecione a escola"}</option>
                {escolas?.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.schoolId?.message} />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/turmas")}
                className="flex-1 py-3 rounded-xl border border-border-input text-ink text-sm font-bold hover:bg-bg-soft transition-colors"
              >
                Cancelar
              </button>
              <Button
                type="submit"
                className="flex-1"
                isLoading={createTurma.isPending}
                disabled={!isValid || referenceDataLoading || createTurma.isPending}
              >
                {createTurma.isPending ? "Criando turma..." : "Criar turma"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
