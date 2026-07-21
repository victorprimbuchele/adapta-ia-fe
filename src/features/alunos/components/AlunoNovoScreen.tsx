import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { Card } from "../../../components/ui/card";
import { getApiErrorCode, getApiErrorMessage } from "../../../infra/http/apiClient";
import { useEnrollStudent } from "../hooks/useEnrollStudent";
import { usePerfisAprendizagem } from "../hooks/usePerfisAprendizagem";
import { AlunoForm } from "./AlunoForm";

const ERROR_MESSAGES: Record<string, string> = {
  STUDENT_ALREADY_ENROLLED: "Este e-mail já está matriculado nesta turma.",
  CLASS_NOT_FOUND: "Turma não encontrada.",
  CLASS_ACCESS_DENIED: "Você não tem acesso a esta turma.",
  LEARNING_PROFILE_NOT_FOUND: "O perfil selecionado não foi encontrado.",
};

export function AlunoNovoScreen() {
  const { id: classId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: perfis, isPending: isPerfisPending } = usePerfisAprendizagem();
  const enrollStudent = useEnrollStudent(classId as string);

  const errorMessage = enrollStudent.isError
    ? (ERROR_MESSAGES[getApiErrorCode(enrollStudent.error) ?? ""] ?? getApiErrorMessage(enrollStudent.error))
    : null;

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <BackBtn onClick={() => navigate(`/turmas/${classId}`)} />
        <h1 className="text-2xl font-bold text-ink mb-1 font-heading">Cadastrar aluno</h1>
        <p className="text-muted text-sm mb-8">
          Configure o perfil de aprendizagem para personalizar as atividades
        </p>

        <Card className="p-6 space-y-5">
          <AlunoForm
            defaultValues={{ name: "", email: "", learningProfileId: "" }}
            perfis={perfis}
            isPerfisPending={isPerfisPending}
            onSubmit={(values) =>
              enrollStudent.mutate(values, { onSuccess: () => navigate(`/turmas/${classId}`) })
            }
            onCancel={() => navigate(`/turmas/${classId}`)}
            isSubmitting={enrollStudent.isPending}
            submitLabel="Cadastrar aluno"
            submittingLabel="Cadastrando..."
            errorMessage={errorMessage}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
