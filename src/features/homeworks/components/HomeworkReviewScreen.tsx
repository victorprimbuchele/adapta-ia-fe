import { useEffect } from "react";
import { AlertCircle, FileText, Loader2, Mail, Send, Sparkles, Volume2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { FormAlert } from "../../../components/shared/FormError";
import { cardBaseClass as cardCls } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { getApiErrorMessage } from "../../../infra/http/apiClient";
import { getProfileCode, parseProfilePrompt } from "../../../lib/learningProfilePrompt";
import type { LearningProfileAdaptations } from "../../../lib/learningProfilePrompt";
import { stripHtmlTags } from "../../../lib/sanitizeText";
import type { Homework } from "../../../types/homework";
import { useLearningProfiles } from "../../students/hooks/useLearningProfiles";
import { useClassDetail } from "../../classes/hooks/useClassDetail";
import { useAdaptationStatus } from "../hooks/useAdaptationStatus";
import { useAuthenticatedFileUrl } from "../hooks/useAuthenticatedFileUrl";
import { useHomeworkDetail } from "../hooks/useHomeworkDetail";
import { useSendHomework } from "../hooks/useSendHomework";
import { useVariantPdf } from "../hooks/useVariantPdf";

function AudioPlayer({ fileId }: { fileId: string }) {
  const { url, isPending, isError } = useAuthenticatedFileUrl(fileId);

  if (isPending) return <Skeleton className="h-10 w-full" />;
  if (isError || !url) {
    return <p className="text-xs text-red-600">Não foi possível carregar o áudio.</p>;
  }
  return (
    <audio controls className="w-full h-10" src={url}>
      Seu navegador não suporta áudio embutido.
    </audio>
  );
}

function VariantCard({
  variant,
  profileName,
  profileCode,
  adaptations,
  recipients,
}: {
  variant: Homework;
  profileName: string;
  profileCode: string | undefined;
  adaptations: LearningProfileAdaptations | undefined;
  recipients: Array<{ id: string; name: string }>;
}) {
  const highContrast = Boolean(adaptations?.highContrast);
  const largeFont = Boolean(adaptations?.largeFont);
  const pdf = useVariantPdf(variant.id);

  return (
    <div className={`${cardCls} overflow-hidden flex flex-col`}>
      <div className="bg-brand px-4 py-3 flex items-center gap-2">
        <span className="text-sm font-bold text-white flex-1 truncate">
          {profileCode ? `${profileCode} · ` : ""}
          {profileName}
        </span>
        <span className="text-xs text-white/70 flex-shrink-0">
          {recipients.length} aluno{recipients.length !== 1 ? "s" : ""}
        </span>
        <button
          type="button"
          onClick={() => pdf.openPdf()}
          disabled={pdf.isPending}
          title="Abrir PDF desta variante"
          className="flex-shrink-0 p-1 rounded hover:bg-white/15 disabled:opacity-50 transition-colors"
        >
          {pdf.isPending ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <FileText className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
      {pdf.isError ? (
        <p className="px-4 pt-2 text-[11px] text-red-600">Não foi possível abrir o PDF.</p>
      ) : null}

      <div
        className={`p-4 flex-1 space-y-3 ${highContrast ? "bg-black text-white" : ""}`}
      >
        <p
          className={`whitespace-pre-wrap leading-relaxed ${largeFont ? "text-base" : "text-xs"} ${
            highContrast ? "text-white font-bold" : "text-ink"
          }`}
        >
          {stripHtmlTags(variant.content)}
        </p>

        {adaptations?.tts && variant.audioFileId ? (
          <div className="pt-2">
            <p
              className={`text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${
                highContrast ? "text-white/70" : "text-muted"
              }`}
            >
              <Volume2 className="w-3 h-3" />
              Áudio
            </p>
            <AudioPlayer fileId={variant.audioFileId} />
          </div>
        ) : null}

        {adaptations?.glossary && variant.glossary && variant.glossary.length > 0 ? (
          <div className={`border-t pt-3 ${highContrast ? "border-white/20" : "border-border-soft"}`}>
            <p
              className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                highContrast ? "text-white/70" : "text-muted"
              }`}
            >
              Glossário
            </p>
            <dl className="space-y-1.5">
              {variant.glossary.map((entry) => (
                <div key={entry.term}>
                  <dt className={`text-xs font-bold inline ${highContrast ? "text-white" : "text-ink"}`}>
                    {entry.term}:{" "}
                  </dt>
                  <dd className={`text-xs inline ${highContrast ? "text-white/80" : "text-muted"}`}>
                    {entry.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>

      {recipients.length > 0 ? (
        <div className="px-4 pb-4 pt-3 border-t border-border-soft">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Destinatários</p>
          <div className="space-y-1.5">
            {recipients.map((student) => (
              <p key={student.id} className="text-xs text-ink font-medium truncate">
                {student.name}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function HomeworkReviewScreen() {
  const { id: homeworkId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: homework, isPending: isHomeworkPending } = useHomeworkDetail(homeworkId);
  const { data: adaptationStatus } = useAdaptationStatus(homeworkId);
  const { data: learningProfiles } = useLearningProfiles();
  const { students } = useClassDetail(homework?.classId);
  const sendHomework = useSendHomework(homeworkId as string);

  const stillProcessing = adaptationStatus?.status === "pendente" || adaptationStatus?.status === "processando";

  useEffect(() => {
    if (stillProcessing) {
      navigate(`/atividades/${homeworkId}/processando`, { replace: true });
    }
  }, [stillProcessing, homeworkId, navigate]);

  const isFullyReady = adaptationStatus?.status === "concluido";
  const totalRecipients = students?.filter((a) => a.learningProfile).length ?? 0;

  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <BackBtn onClick={() => navigate("/dashboard")} label="Dashboard" />

        {isHomeworkPending || !homework ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand bg-brand-soft px-3 py-1.5 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Versões geradas pela IA
              </div>
              <h1 className="text-2xl font-bold text-ink font-heading">{homework.title}</h1>
            </div>

            {homework.adaptations.length === 0 ? (
              <div className={`${cardCls} p-10 text-center`}>
                <AlertCircle className="w-8 h-8 text-muted mx-auto mb-3" />
                <p className="text-sm text-muted">Nenhuma variante foi gerada com sucesso ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {homework.adaptations.map((variant) => {
                  const profile = learningProfiles?.find((p) => p.id === variant.learningProfileId);
                  const prompt = profile ? parseProfilePrompt(profile.prompt) : null;
                  const recipients =
                    students?.filter((a) => a.learningProfile?.id === variant.learningProfileId) ?? [];

                  return (
                    <VariantCard
                      key={variant.id}
                      variant={variant}
                      profileName={profile?.name ?? "Perfil de aprendizagem"}
                      profileCode={profile ? getProfileCode(profile) : undefined}
                      adaptations={prompt?.adaptations}
                      recipients={recipients}
                    />
                  );
                })}
              </div>
            )}

            <FormAlert message={sendHomework.isError ? getApiErrorMessage(sendHomework.error) : null} />

            <div className={`${cardCls} p-5 flex items-center justify-between gap-4 flex-wrap`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-bold text-sm text-ink">
                    {isFullyReady ? "Tudo pronto para enviar" : "Alguns learningProfiles ainda não estão prontos"}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {totalRecipients} aluno{totalRecipients !== 1 ? "s" : ""} receberá
                    {totalRecipients !== 1 ? "ão" : ""} a versão adaptada por e-mail
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={!isFullyReady || sendHomework.isPending}
                onClick={() =>
                  sendHomework.mutate(undefined, {
                    onSuccess: (result) => navigate(`/atividades/${homeworkId}/envio/${result.deliveryId}`),
                  })
                }
                className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand/25"
              >
                {sendHomework.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Confirmar e enviar
              </button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
