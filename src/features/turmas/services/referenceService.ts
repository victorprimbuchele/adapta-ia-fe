import { apiClient } from "../../../infra/http/apiClient";
import type { Grade } from "../../../types/grade";
import type { LearningProfile } from "../../../types/class";
import type { School } from "../../../types/school";

// Dados de referência/seed (docs/API.md §6.3/§6.5) — cache longo nos hooks,
// já que escolas, séries e perfis de aprendizagem praticamente não mudam
// durante a sessão.
export const referenceService = {
  listSchools: (): Promise<School[]> => apiClient.get<School[]>("/escolas").then((r) => r.data),

  listGrades: (): Promise<Grade[]> => apiClient.get<Grade[]>("/series").then((r) => r.data),

  listLearningProfiles: (): Promise<LearningProfile[]> =>
    apiClient.get<LearningProfile[]>("/perfis-aprendizagem").then((r) => r.data),
};
