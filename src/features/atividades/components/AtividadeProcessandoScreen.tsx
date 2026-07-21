import { useEffect, useRef } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import {
  getApiErrorCode,
  getApiErrorMessage,
} from "../../../infra/http/apiClient";
import { usePerfisAprendizagem } from "../../alunos/hooks/usePerfisAprendizagem";
import { useAdaptHomework } from "../hooks/useAdaptHomework";
import { useAdaptationStatus } from "../hooks/useAdaptationStatus";
import { useHomeworkDetail } from "../hooks/useHomeworkDetail";
import type {
  AdaptationStatus,
  ProfileAdaptationStatus,
} from "../../../types/homework";

const cardCls = "bg-white rounded-2xl border border-border-soft";

const ERROR_MESSAGES: Record<string, string> = {
  NO_LEARNING_PROFILES_TO_ADAPT:
    "Nenhum aluno desta turma tem um perfil de aprendizagem definido ainda. Volte à turma e vincule ao menos um perfil antes de gerar adaptações.",
  HOMEWORK_NOT_FOUND: "Atividade não encontrada.",
  HOMEWORK_ACCESS_DENIED: "Você não tem acesso a esta atividade.",
};

function StatusPill({ status }: { status: AdaptationStatus }) {
  const config: Record<
    AdaptationStatus,
    { label: string; cls: string; Icon: typeof Clock }
  > = {
    pendente: {
      label: "Pendente",
      cls: "bg-slate-100 text-slate-600",
      Icon: Clock,
    },
    processando: {
      label: "Processando",
      cls: "bg-blue-50 text-blue-700",
      Icon: Loader2,
    },
    concluido: {
      label: "Concluído",
      cls: "bg-green-50 text-green-700",
      Icon: CheckCircle2,
    },
    erro: { label: "Falhou", cls: "bg-red-50 text-red-700", Icon: AlertCircle },
  };
  const { label, cls, Icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}
    >
      <Icon
        className={`w-3.5 h-3.5 ${status === "processando" ? "animate-spin" : ""}`}
      />
      {label}
    </span>
  );
}

export function AtividadeProcessandoScreen() {
  const { id: homeworkId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: homework } = useHomeworkDetail(homeworkId);
  const { data: perfis } = usePerfisAprendizagem();
  const adaptHomework = useAdaptHomework(homeworkId as string);
  const { data: adaptationStatus, isPending: isStatusPending } =
    useAdaptationStatus(homeworkId);

  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!homeworkId || triggeredRef.current) return;
    triggeredRef.current = true;
    adaptHomework.mutate(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeworkId]);

  useEffect(() => {
    if (adaptationStatus?.status === "concluido") {
      navigate(`/atividades/${homeworkId}/revisao`, { replace: true });
    }
  }, [adaptationStatus?.status, homeworkId, navigate]);

  const profileName = (learningProfileId: string) =>
    perfis?.find((p) => p.id === learningProfileId)?.name ??
    "Perfil de aprendizagem";

  const handleRetry = (profile: ProfileAdaptationStatus) => {
    adaptHomework.mutate([profile.learningProfileId]);
  };

  const triggerErrorMessage =
    adaptHomework.isError &&
    (!adaptationStatus || adaptationStatus.adaptations.length === 0)
      ? (ERROR_MESSAGES[getApiErrorCode(adaptHomework.error) ?? ""] ??
        getApiErrorMessage(adaptHomework.error))
      : null;

  const adaptations = adaptationStatus?.adaptations ?? [];
  const hasAnyCompleted = adaptations.some((a) => a.status === "concluido");
  const stillWorking = adaptations.some(
    (a) => a.status === "pendente" || a.status === "processando",
  );

  return (
    <AppLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <BackBtn onClick={() => navigate("/dashboard")} label="Dashboard" />

        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand bg-[#E8F5F0] px-3 py-1.5 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Gerando versões adaptadas
        </div>
        <h1 className="text-2xl font-bold text-ink mb-1 font-heading">
          {homework?.title ?? "Atividade"}
        </h1>
        <p className="text-muted text-sm mb-8">
          A IA está adaptando o conteúdo para cada perfil de aprendizagem da
          turma. Isso pode levar alguns instantes.
        </p>

        {triggerErrorMessage ? (
          <div className={`${cardCls} p-8 text-center`}>
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-ink font-medium mb-4">
              {triggerErrorMessage}
            </p>
            <button
              type="button"
              onClick={() => navigate("/turmas")}
              className="text-sm text-brand font-bold hover:underline"
            >
              Ver turmas
            </button>
          </div>
        ) : isStatusPending && adaptations.length === 0 ? (
          <div className={`${cardCls} p-8 text-center`} role="status">
            <Loader2
              className="w-6 h-6 text-brand animate-spin mx-auto"
              aria-hidden="true"
            />
            <span className="sr-only">Carregando status da adaptação...</span>
          </div>
        ) : (
          <div className="space-y-3" role="status" aria-live="polite">
            {adaptations.map((profile) => (
              <div
                key={profile.learningProfileId}
                className={`${cardCls} p-4 flex items-center justify-between gap-4`}
              >
                <div className="min-w-0">
                  <p className="font-bold text-sm text-ink truncate">
                    {profileName(profile.learningProfileId)}
                  </p>
                  {profile.status === "erro" && profile.failedReason ? (
                    <p className="text-xs text-red-600 mt-1">
                      {profile.failedReason}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusPill status={profile.status} />
                  {profile.status === "erro" ? (
                    <button
                      type="button"
                      onClick={() => handleRetry(profile)}
                      disabled={adaptHomework.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand border border-brand/25 rounded-lg hover:bg-[#E8F5F0] transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Tentar novamente
                    </button>
                  ) : null}
                </div>
              </div>
            ))}

            {!stillWorking &&
            hasAnyCompleted &&
            adaptationStatus?.status === "erro" ? (
              <button
                type="button"
                onClick={() => navigate(`/atividades/${homeworkId}/revisao`)}
                className="w-full py-3 rounded-xl border-2 border-dashed border-brand/40 text-brand text-sm font-bold hover:bg-[#E8F5F0] transition-colors"
              >
                Ver adaptações concluídas mesmo assim
              </button>
            ) : null}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
