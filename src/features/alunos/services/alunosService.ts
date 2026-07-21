import { apiClient } from "../../../infra/http/apiClient";
import type { LearningProfile } from "../../../types/class";

export interface EnrollStudentPayload {
  name: string;
  email: string;
}

export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
}

export type UpdateStudentPayload = EnrollStudentPayload;

export interface AssignLearningProfileResult {
  studentId: string;
  learningProfileId: string;
  learningProfile: LearningProfile;
}

// Camada de services (ADR 014). docs/API.md §5.2: matrícula e vínculo de
// perfil são duas chamadas encadeadas, não uma única composta.
export const alunosService = {
  enrollStudent: (classId: string, payload: EnrollStudentPayload): Promise<EnrolledStudent> =>
    apiClient.post<EnrolledStudent>(`/turmas/${classId}/alunos`, payload).then((r) => r.data),

  updateStudent: (
    classId: string,
    studentId: string,
    payload: UpdateStudentPayload,
  ): Promise<EnrolledStudent> =>
    apiClient
      .patch<EnrolledStudent>(`/turmas/${classId}/alunos/${studentId}`, payload)
      .then((r) => r.data),

  assignLearningProfile: (
    studentId: string,
    learningProfileId: string,
  ): Promise<AssignLearningProfileResult> =>
    apiClient
      .post<AssignLearningProfileResult>(`/alunos/${studentId}/perfil-aprendizagem`, { learningProfileId })
      .then((r) => r.data),

  removeStudent: (classId: string, studentId: string): Promise<void> =>
    apiClient.delete(`/turmas/${classId}/alunos/${studentId}`).then(() => undefined),
};
