import { FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { FieldError, FormAlert } from "../../../components/shared/FormError";
import { Card, cardBaseClass as cardCls } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select } from "../../../components/ui/select";
import { Skeleton } from "../../../components/ui/skeleton";
import { Textarea } from "../../../components/ui/textarea";
import { getApiErrorCode, getApiErrorMessage } from "../../../infra/http/apiClient";
import { DISCIPLINAS } from "../constants";
import { useCreateHomework } from "../hooks/useCreateHomework";
import { useClassOptions } from "../hooks/useClassOptions";
import { homeworkSchema, type HomeworkFormValues } from "../schemas/homeworkSchemas";

const ERROR_MESSAGES: Record<string, string> = {
  CLASS_NOT_FOUND: "Turma não encontrada.",
  CLASS_ACCESS_DENIED: "Você não tem acesso a esta turma.",
  TEACHER_NOT_FOUND: "Sua sessão parece inválida. Faça login novamente.",
};

function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className={`${cardCls} p-10 text-center max-w-md mx-auto mt-8`}>
      <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center mx-auto mb-4">
        <FileText className="w-7 h-7 text-brand" />
      </div>
      <h2 className="text-lg font-bold text-ink font-heading mb-1.5">Crie uma turma primeiro</h2>
      <p className="text-sm text-muted mb-6">
        Toda atividade precisa de uma turma destinatária. Cadastre uma turma antes de criar a primeira atividade.
      </p>
      <button
        type="button"
        onClick={() => navigate("/turmas/nova")}
        className="inline-flex items-center gap-2 px-5 py-3 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-brand/20"
      >
        Criar turma
      </button>
    </div>
  );
}

export function HomeworkNewScreen() {
  const navigate = useNavigate();
  const { data: classes, isPending: isClassesPending } = useClassOptions();
  const createHomework = useCreateHomework();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<HomeworkFormValues>({
    resolver: zodResolver(homeworkSchema),
    mode: "onChange",
    defaultValues: { title: "", subject: "", classId: "", content: "", question: "" },
  });

  const onSubmit = handleSubmit((values) => {
    createHomework.mutate(values, {
      onSuccess: (homework) => navigate(`/atividades/${homework.id}/processando`),
    });
  });

  const errorMessage = createHomework.isError
    ? (ERROR_MESSAGES[getApiErrorCode(createHomework.error) ?? ""] ?? getApiErrorMessage(createHomework.error))
    : null;

  return (
    <AppLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <BackBtn onClick={() => navigate("/dashboard")} />
        <h1 className="text-2xl font-bold text-ink mb-1 font-heading">Nova atividade</h1>
        <p className="text-muted text-sm mb-8">
          Preencha o conteúdo; a próxima etapa gera versões adaptadas para cada perfil com IA
        </p>

        {isClassesPending ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : !classes || classes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <FormAlert message={errorMessage} />

            <form className="space-y-4" onSubmit={onSubmit} noValidate>
              <Card className="p-6 space-y-4">
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Identificação</p>
                <div>
                  <Label htmlFor="title">Título da atividade</Label>
                  <Input id="title" placeholder="Ex: Interpretação — Capítulo 3" {...register("title")} />
                  <FieldError message={errors.title?.message} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Disciplina</Label>
                    <Select id="subject" {...register("subject")}>
                      <option value="">Selecione a disciplina</option>
                      {DISCIPLINAS.map((disciplina) => (
                        <option key={disciplina} value={disciplina}>
                          {disciplina}
                        </option>
                      ))}
                    </Select>
                    <FieldError message={errors.subject?.message} />
                  </div>
                  <div>
                    <Label htmlFor="classId">Turma destinatária</Label>
                    <Select id="classId" {...register("classId")}>
                      <option value="">Selecione a turma</option>
                      {classes.map((classItem) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </option>
                      ))}
                    </Select>
                    <FieldError message={errors.classId?.message} />
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Conteúdo</p>
                <div>
                  <Label htmlFor="content">Texto principal</Label>
                  <Textarea
                    id="content"
                    rows={5}
                    placeholder="Cole ou escreva o texto da atividade..."
                    {...register("content")}
                  />
                  <FieldError message={errors.content?.message} />
                </div>
                <div>
                  <Label htmlFor="question">Questões</Label>
                  <Textarea
                    id="question"
                    rows={4}
                    placeholder="Escreva as questões numeradas..."
                    {...register("question")}
                  />
                  <FieldError message={errors.question?.message} />
                </div>
              </Card>

              <button
                type="submit"
                disabled={!isValid || createHomework.isPending}
                className="w-full py-4 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-sm transition-colors flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand/25"
              >
                {createHomework.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando rascunho...
                  </>
                ) : (
                  "Salvar e continuar"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </AppLayout>
  );
}
