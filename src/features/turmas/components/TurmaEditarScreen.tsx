import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { getApiErrorCode, getApiErrorMessage } from "../../../infra/http/apiClient";
import { useEscolas } from "../hooks/useEscolas";
import { useTurmaDetalhe } from "../hooks/useTurmaDetalhe";
import { useUpdateTurma } from "../hooks/useUpdateTurma";
import { TurmaForm } from "./TurmaForm";

const ERROR_MESSAGES: Record<string, string> = {
  GRADE_NOT_FOUND: "A série selecionada não foi encontrada.",
  CLASS_NOT_FOUND: "Turma não encontrada.",
  CLASS_ACCESS_DENIED: "Você não tem acesso a esta turma.",
};

function FormSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export function TurmaEditarScreen() {
  const { id: classId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { turma, isPending, isError } = useTurmaDetalhe(classId);
  const { data: escolas, isPending: isEscolasPending } = useEscolas();
  const updateTurma = useUpdateTurma(classId as string);
  const schoolName = escolas?.find((school) => school.id === turma?.schoolId)?.name;

  const errorMessage = updateTurma.isError
    ? (ERROR_MESSAGES[getApiErrorCode(updateTurma.error) ?? ""] ?? getApiErrorMessage(updateTurma.error))
    : null;

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <BackBtn onClick={() => navigate(`/turmas/${classId}`)} label="Turma" />
        <h1 className="text-2xl font-bold text-ink mb-1 font-heading">Editar turma</h1>
        <p className="text-muted text-sm mb-8">Atualize os dados da turma</p>

        <Card className="p-6">
          {isPending || isEscolasPending ? (
            <FormSkeleton />
          ) : isError || !turma ? (
            <p className="text-sm text-muted">Não foi possível carregar esta turma.</p>
          ) : (
            <TurmaForm
              defaultValues={{
                name: turma.name,
                schoolName: schoolName ?? "",
                gradeId: turma.gradeId,
              }}
              onSubmit={(values) =>
                updateTurma.mutate(values, { onSuccess: () => navigate(`/turmas/${classId}`) })
              }
              onCancel={() => navigate(`/turmas/${classId}`)}
              isSubmitting={updateTurma.isPending}
              submitLabel="Salvar alterações"
              submittingLabel="Salvando..."
              errorMessage={errorMessage}
            />
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
