import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { getApiErrorCode, getApiErrorMessage } from "../../../infra/http/apiClient";
import { useClassDetail } from "../../classes/hooks/useClassDetail";
import { useLearningProfiles } from "../hooks/useLearningProfiles";
import { useUpdateStudent } from "../hooks/useUpdateStudent";
import { StudentForm } from "./StudentForm";

const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_IN_USE: "Este e-mail já está em uso por outra pessoa.",
  CLASS_NOT_FOUND: "Turma não encontrada.",
  CLASS_ACCESS_DENIED: "Você não tem acesso a esta turma.",
  STUDENT_NOT_ENROLLED: "Este aluno não está mais vinculado a esta turma.",
  LEARNING_PROFILE_NOT_FOUND: "O perfil selecionado não foi encontrado.",
};

function FormSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

export function StudentEditScreen() {
  const { id: classId, studentId } = useParams<{ id: string; studentId: string }>();
  const navigate = useNavigate();
  const { students, isPending: isClassPending, isError: isClassError } = useClassDetail(classId);
  const { data: learningProfiles, isPending: isLearningProfilesPending } = useLearningProfiles();
  const updateStudent = useUpdateStudent(classId as string, studentId as string);

  const student = students?.find((item) => item.id === studentId);

  const errorMessage = updateStudent.isError
    ? (ERROR_MESSAGES[getApiErrorCode(updateStudent.error) ?? ""] ?? getApiErrorMessage(updateStudent.error))
    : null;

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <BackBtn onClick={() => navigate(`/turmas/${classId}`)} label="Turma" />
        <h1 className="text-2xl font-bold text-ink mb-1 font-heading">Editar aluno</h1>
        <p className="text-muted text-sm mb-8">Atualize os dados e o perfil de aprendizagem</p>

        <Card className="p-6 space-y-5">
          {isClassPending ? (
            <FormSkeleton />
          ) : isClassError || !student ? (
            <p className="text-sm text-muted">
              Não foi possível carregar este aluno. Ele pode ter sido removido da turma.
            </p>
          ) : (
            <StudentForm
              defaultValues={{
                name: student.name,
                email: student.email,
                learningProfileId: student.learningProfile?.id ?? "",
              }}
              learningProfiles={learningProfiles}
              isLearningProfilesPending={isLearningProfilesPending}
              onSubmit={(values) =>
                updateStudent.mutate(values, { onSuccess: () => navigate(`/turmas/${classId}`) })
              }
              onCancel={() => navigate(`/turmas/${classId}`)}
              isSubmitting={updateStudent.isPending}
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
