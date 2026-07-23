import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { getApiErrorCode, getApiErrorMessage } from "../../../infra/http/apiClient";
import { useSchools } from "../hooks/useSchools";
import { useClassDetail } from "../hooks/useClassDetail";
import { useUpdateClass } from "../hooks/useUpdateClass";
import { ClassForm } from "./ClassForm";

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

export function ClassEditScreen() {
  const { id: classId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classDetail, isPending, isError } = useClassDetail(classId);
  const { data: schools, isPending: isSchoolsPending } = useSchools();
  const updateClass = useUpdateClass(classId as string);
  const schoolName = schools?.find((school) => school.id === classDetail?.schoolId)?.name;

  const errorMessage = updateClass.isError
    ? (ERROR_MESSAGES[getApiErrorCode(updateClass.error) ?? ""] ?? getApiErrorMessage(updateClass.error))
    : null;

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <BackBtn onClick={() => navigate(`/turmas/${classId}`)} label="Turma" />
        <h1 className="text-2xl font-bold text-ink mb-1 font-heading">Editar turma</h1>
        <p className="text-muted text-sm mb-8">Atualize os dados da turma</p>

        <Card className="p-6">
          {isPending || isSchoolsPending ? (
            <FormSkeleton />
          ) : isError || !classDetail ? (
            <p className="text-sm text-muted">Não foi possível carregar esta turma.</p>
          ) : (
            <ClassForm
              defaultValues={{
                name: classDetail.name,
                schoolName: schoolName ?? "",
                gradeId: classDetail.gradeId,
              }}
              onSubmit={(values) =>
                updateClass.mutate(values, { onSuccess: () => navigate(`/turmas/${classId}`) })
              }
              onCancel={() => navigate(`/turmas/${classId}`)}
              isSubmitting={updateClass.isPending}
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
