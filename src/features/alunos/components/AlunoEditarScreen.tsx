import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { getApiErrorCode, getApiErrorMessage } from "../../../infra/http/apiClient";
import { useTurmaDetalhe } from "../../turmas/hooks/useTurmaDetalhe";
import { usePerfisAprendizagem } from "../hooks/usePerfisAprendizagem";
import { useUpdateStudent } from "../hooks/useUpdateStudent";
import { AlunoForm } from "./AlunoForm";

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

export function AlunoEditarScreen() {
  const { id: classId, alunoId } = useParams<{ id: string; alunoId: string }>();
  const navigate = useNavigate();
  const { alunos, isPending: isTurmaPending, isError: isTurmaError } = useTurmaDetalhe(classId);
  const { data: perfis, isPending: isPerfisPending } = usePerfisAprendizagem();
  const updateStudent = useUpdateStudent(classId as string, alunoId as string);

  const student = alunos?.find((aluno) => aluno.id === alunoId);

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
          {isTurmaPending ? (
            <FormSkeleton />
          ) : isTurmaError || !student ? (
            <p className="text-sm text-muted">
              Não foi possível carregar este aluno. Ele pode ter sido removido da turma.
            </p>
          ) : (
            <AlunoForm
              defaultValues={{
                name: student.name,
                email: student.email,
                learningProfileId: student.learningProfile?.id ?? "",
              }}
              perfis={perfis}
              isPerfisPending={isPerfisPending}
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
