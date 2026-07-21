import { apiClient } from "../../../infra/http/apiClient";
import type { DeliveryDetail } from "../../../types/delivery";
import type { Homework, HomeworkAdaptationStatus, HomeworkDetail } from "../../../types/homework";

export interface CreateHomeworkPayload {
  title: string;
  content: string;
  question: string;
  subject: string;
  classId: string;
}

export interface AdaptHomeworkResult {
  homeworkId: string;
  enqueuedLearningProfileIds: string[];
  skippedLearningProfileIds: string[];
}

export interface SendHomeworkResult {
  deliveryId: string;
  enqueuedCount: number;
  skippedCount: number;
}

export interface ResendDeliveryResult {
  deliveryId: string;
  requeuedCount: number;
}

// Camada de services (ADR 014). `question`/`subject` são validados no
// backend mas não persistidos (docs/API.md §9.1) — enviados mesmo assim
// por exigência do boundary HTTP.
export const atividadesService = {
  createHomework: (payload: CreateHomeworkPayload): Promise<Homework> =>
    apiClient.post<Homework>("/homeworks", payload).then((r) => r.data),

  getHomeworkDetail: (homeworkId: string): Promise<HomeworkDetail> =>
    apiClient.get<HomeworkDetail>(`/homeworks/${homeworkId}`).then((r) => r.data),

  // `learningProfileIds` omitido: backend usa os perfis distintos já
  // vinculados aos alunos da turma (docs/API.md §6.7). Informado: usado
  // para o retry de um único perfil (Épico FE-6, tarefa 3).
  adaptHomework: (homeworkId: string, learningProfileIds?: string[]): Promise<AdaptHomeworkResult> =>
    apiClient
      .post<AdaptHomeworkResult>(`/homeworks/${homeworkId}/adaptar`, learningProfileIds ? { learningProfileIds } : {})
      .then((r) => r.data),

  getAdaptationStatus: (homeworkId: string): Promise<HomeworkAdaptationStatus> =>
    apiClient
      .get<HomeworkAdaptationStatus>(`/homeworks/${homeworkId}/status-adaptacao`)
      .then((r) => r.data),

  // Um destinatário por aluno da turma com perfil vinculado; envia a
  // variante correspondente ao perfil (docs/API.md §6.9). Assíncrono.
  sendHomework: (homeworkId: string): Promise<SendHomeworkResult> =>
    apiClient.post<SendHomeworkResult>(`/homeworks/${homeworkId}/enviar`).then((r) => r.data),

  getDelivery: (deliveryId: string): Promise<DeliveryDetail> =>
    apiClient.get<DeliveryDetail>(`/envios/${deliveryId}`).then((r) => r.data),

  // Reenvia só quem falhou (com variante disponível) — quem já recebeu
  // não é afetado (docs/API.md §6.10).
  resendDelivery: (deliveryId: string): Promise<ResendDeliveryResult> =>
    apiClient.post<ResendDeliveryResult>(`/envios/${deliveryId}/reenviar`).then((r) => r.data),
};
