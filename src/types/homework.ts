import type { ISODateString } from "./user";

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface Homework {
  id: string;
  title: string;
  content: string;
  glossary: GlossaryEntry[] | null;
  isDraft: boolean;
  homeworkId: string | null;
  learningProfileId: string | null;
  audioFileId: string | null;
  classId: string;
  teacherId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface HomeworkDetail extends Homework {
  /** Variantes (uma por perfil adaptado), ordenadas por criação. */
  adaptations: Homework[];
}

export type AdaptationStatus = "pendente" | "processando" | "concluido" | "erro";

export interface ProfileAdaptationStatus {
  learningProfileId: string;
  status: AdaptationStatus;
  /** Presente somente se status === "concluido". */
  variantId?: string;
  /** Presente somente se status === "erro" (falha persistente). */
  failedReason?: string;
}

export interface HomeworkAdaptationStatus {
  homeworkId: string;
  status: AdaptationStatus;
  adaptations: ProfileAdaptationStatus[];
}
