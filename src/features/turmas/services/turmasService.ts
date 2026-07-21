import { apiClient } from "../../../infra/http/apiClient";
import type { Class, ClassDetail, ClassStudentWithProfile } from "../../../types/class";
import type { Homework } from "../../../types/homework";

export interface CreateClassPayload {
  name: string;
  schoolName: string;
  gradeId: string;
}

export type UpdateClassPayload = CreateClassPayload;

// Camada de services (ADR 014): orquestra chamadas HTTP; hooks não falam
// com o Axios diretamente. Não existe endpoint agregado de dashboard
// (docs/API.md), então o resumo é composto no hook a partir destas chamadas.
export const turmasService = {
  listClasses: (): Promise<Class[]> => apiClient.get<Class[]>("/turmas").then((r) => r.data),

  getClassDetail: (classId: string): Promise<ClassDetail> =>
    apiClient.get<ClassDetail>(`/turmas/${classId}`).then((r) => r.data),

  createClass: (payload: CreateClassPayload): Promise<Class> =>
    apiClient.post<Class>("/turmas", payload).then((r) => r.data),

  updateClass: (classId: string, payload: UpdateClassPayload): Promise<Class> =>
    apiClient.put<Class>(`/turmas/${classId}`, payload).then((r) => r.data),

  deleteClass: (classId: string): Promise<void> =>
    apiClient.delete(`/turmas/${classId}`).then(() => undefined),

  listClassStudents: (classId: string): Promise<ClassStudentWithProfile[]> =>
    apiClient.get<ClassStudentWithProfile[]>(`/turmas/${classId}/alunos`).then((r) => r.data),

  listClassActivities: (classId: string): Promise<Homework[]> =>
    apiClient.get<Homework[]>(`/turmas/${classId}/atividades`).then((r) => r.data),
};
