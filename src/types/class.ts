import type { ISODateString } from "./user";

export interface Class {
  id: string;
  name: string;
  schoolId: string;
  gradeId: string;
  teacherId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
}

export interface ClassDetail extends Class {
  /** No MVP atual este array vem sempre vazio (docs/API.md §4/§9.4) — usar GET /turmas/:id/alunos. */
  students: unknown[];
}

export interface LearningProfile {
  id: string;
  name: string;
  prompt: unknown;
}

export interface ClassStudentWithProfile {
  id: string;
  name: string;
  email: string;
  learningProfile: LearningProfile | null;
}
