import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { Card } from "../../../components/ui/card";
import { getApiErrorCode, getApiErrorMessage } from "../../../infra/http/apiClient";
import { useCreateClass } from "../hooks/useCreateClass";
import { ClassForm } from "./ClassForm";

const ERROR_MESSAGES: Record<string, string> = {
  GRADE_NOT_FOUND: "A série selecionada não foi encontrada.",
  TEACHER_NOT_FOUND: "Sua sessão parece inválida. Faça login novamente.",
};

export function ClassNewScreen() {
  const navigate = useNavigate();
  const createClass = useCreateClass();

  const errorMessage = createClass.isError
    ? (ERROR_MESSAGES[getApiErrorCode(createClass.error) ?? ""] ?? getApiErrorMessage(createClass.error))
    : null;

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <BackBtn onClick={() => navigate("/turmas")} label="Turmas" />
        <h1 className="text-2xl font-bold text-ink mb-1 font-heading">Nova turma</h1>
        <p className="text-muted text-sm mb-8">Preencha os dados para criar a turma</p>

        <Card className="p-6">
          <ClassForm
            defaultValues={{ name: "", schoolName: "", gradeId: "" }}
            onSubmit={(values) =>
              createClass.mutate(values, { onSuccess: (classItem) => navigate(`/turmas/${classItem.id}`) })
            }
            onCancel={() => navigate("/turmas")}
            isSubmitting={createClass.isPending}
            submitLabel="Criar turma"
            submittingLabel="Criando turma..."
            errorMessage={errorMessage}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
