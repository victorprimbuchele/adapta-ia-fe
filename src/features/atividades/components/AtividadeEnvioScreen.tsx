import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../../components/shared/AppLayout";
import { BackBtn } from "../../../components/shared/BackBtn";
import { cardBaseClass as cardCls } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { getApiErrorMessage } from "../../../infra/http/apiClient";
import type {
  DeliveryRecipient,
  DeliveryRecipientStatus,
} from "../../../types/delivery";
import { useDeliveryStatus } from "../hooks/useDeliveryStatus";
import { useResendDelivery } from "../hooks/useResendDelivery";

function RecipientStatusPill({ status }: { status: DeliveryRecipientStatus }) {
  const config: Record<
    DeliveryRecipientStatus,
    { label: string; cls: string; Icon: typeof Loader2 }
  > = {
    pendente: {
      label: "Enviando...",
      cls: "bg-blue-50 text-blue-700",
      Icon: Loader2,
    },
    enviado: {
      label: "Enviado",
      cls: "bg-green-50 text-green-700",
      Icon: CheckCircle2,
    },
    falhou: {
      label: "Falhou",
      cls: "bg-red-50 text-red-700",
      Icon: AlertCircle,
    },
  };
  const { label, cls, Icon } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}
    >
      <Icon
        className={`w-3.5 h-3.5 ${status === "pendente" ? "animate-spin" : ""}`}
      />
      {label}
    </span>
  );
}

function RecipientRow({ recipient }: { recipient: DeliveryRecipient }) {
  return (
    <div className={`${cardCls} p-4 flex items-center justify-between gap-4`}>
      <div className="min-w-0">
        <p className="font-bold text-sm text-ink truncate">
          {recipient.studentName}
        </p>
        <p className="text-xs text-muted truncate">{recipient.studentEmail}</p>
        {recipient.status === "falhou" && recipient.failedReason ? (
          <p className="text-xs text-red-600 mt-1">{recipient.failedReason}</p>
        ) : null}
      </div>
      <RecipientStatusPill status={recipient.status} />
    </div>
  );
}

export function AtividadeEnvioScreen() {
  const { id: homeworkId, deliveryId } = useParams<{
    id: string;
    deliveryId: string;
  }>();
  const navigate = useNavigate();
  const { data: delivery, isPending } = useDeliveryStatus(deliveryId);
  const resendDelivery = useResendDelivery(deliveryId as string);

  const recipients = delivery?.recipients ?? [];
  const stillSending = recipients.some((r) => r.status === "pendente");
  const sentCount = recipients.filter((r) => r.status === "enviado").length;
  const failedCount = recipients.filter((r) => r.status === "falhou").length;
  const resendableCount = recipients.filter(
    (r) => r.status === "falhou" && r.variantHomeworkId !== null,
  ).length;

  return (
    <AppLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <BackBtn
          onClick={() => navigate(`/atividades/${homeworkId}/revisao`)}
          label="Revisão"
        />

        {isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <div className="mb-8" role="status" aria-live="polite">
              <h1 className="text-2xl font-bold text-ink font-heading">
                {stillSending
                  ? "Enviando atividade..."
                  : failedCount > 0
                    ? "Envio com falhas"
                    : "Envio concluído"}
              </h1>
              <p className="text-muted text-sm mt-1">
                {sentCount} de {recipients.length} aluno
                {recipients.length !== 1 ? "s" : ""} receberam a atividade por
                e-mail
                {failedCount > 0
                  ? ` · ${failedCount} falha${failedCount !== 1 ? "s" : ""}`
                  : ""}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {recipients.map((recipient) => (
                <RecipientRow key={recipient.id} recipient={recipient} />
              ))}
            </div>

            {!stillSending && failedCount > 0 ? (
              <div
                className={`${cardCls} p-5 flex items-center justify-between gap-4 flex-wrap`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-ink">
                      {failedCount} e-mail{failedCount !== 1 ? "s" : ""} não
                      chegou{failedCount !== 1 ? "ram" : ""}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      Quem já recebeu não será afetado pelo reenvio.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => resendDelivery.mutate()}
                  disabled={resendableCount === 0 || resendDelivery.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand/25"
                >
                  {resendDelivery.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Reenviar falhas
                </button>
              </div>
            ) : null}

            {resendDelivery.isError ? (
              <p className="text-sm text-red-600 mt-3">
                {getApiErrorMessage(resendDelivery.error)}
              </p>
            ) : null}

            {!stillSending && failedCount === 0 ? (
              <div className={`${cardCls} p-6 flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-brand" />
                </div>
                <p className="text-sm text-ink font-medium">
                  Todos os e-mails foram entregues com sucesso.
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </AppLayout>
  );
}
