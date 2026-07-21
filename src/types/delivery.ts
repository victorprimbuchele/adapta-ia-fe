import type { ISODateString } from "./user";

export type DeliveryRecipientStatus = "pendente" | "enviado" | "falhou";

export interface DeliveryRecipient {
  id: string;
  deliveryId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  /** Null quando o perfil do aluno não tinha variante adaptada pronta. */
  variantHomeworkId: string | null;
  status: DeliveryRecipientStatus;
  failedReason: string | null;
  sentAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface DeliveryDetail {
  id: string;
  homeworkId: string;
  teacherId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  recipients: DeliveryRecipient[];
}
