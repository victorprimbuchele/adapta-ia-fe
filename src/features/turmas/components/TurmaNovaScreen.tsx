import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { Card } from "../../../components/ui/card";
import { getApiErrorCode, getApiErrorMessage } from "../../../infra/http/apiClient";
import { useCreateTurma } from "../hooks/useCreateTurma";
import { TurmaForm } from "./TurmaForm";

const ERROR_MESSAGES: Record<string, string> = {
  GRADE_NOT_FOUND: "A série selecionada não foi encontrada.",
  TEACHER_NOT_FOUND: "Sua sessão parece inválida. Faça login novamente.",
};

export function TurmaNovaScreen() {
  const navigate = useNavigate();
  const createTurma = useCreateTurma();

  const errorMessage = createTurma.isError
    ? (ERROR_MESSAGES[getApiErrorCode(createTurma.error) ?? ""] ?? getApiErrorMessage(createTurma.error))
    : null;

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <BackBtn onClick={() => navigate("/turmas")} label="Turmas" />
        <h1 className="text-2xl font-bold text-ink mb-1 font-heading">Nova turma</h1>
        <p className="text-muted text-sm mb-8">Preencha os dados para criar a turma</p>

        <Card className="p-6">
          <TurmaForm
            defaultValues={{ name: "", schoolName: "", gradeId: "" }}
            onSubmit={(values) =>
              createTurma.mutate(values, { onSuccess: (turma) => navigate(`/turmas/${turma.id}`) })
            }
            onCancel={() => navigate("/turmas")}
            isSubmitting={createTurma.isPending}
            submitLabel="Criar turma"
            submittingLabel="Criando turma..."
            errorMessage={errorMessage}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
