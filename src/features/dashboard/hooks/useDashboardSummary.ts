import { useQuery } from "@tanstack/react-query";
import { turmasService } from "../../turmas/services/turmasService";

export interface DashboardTurmaSummary {
  id: string;
  name: string;
  studentCount: number;
}

export interface DashboardActivity {
  id: string;
  title: string;
  classId: string;
  className: string;
  createdAt: string;
  isDraft: boolean;
}

export interface DashboardSummary {
  turmasCount: number;
  alunosCount: number;
  atividadesCount: number;
  atividadesEnviadasCount: number;
  turmas: DashboardTurmaSummary[];
  recentActivities: DashboardActivity[];
}

// Não existe endpoint agregado de dashboard (docs/api.md não lista
// GET /dashboard/resumo), então o resumo é composto aqui a partir de
// GET /turmas + GET /turmas/:id/alunos + GET /turmas/:id/atividades — é
// detalhe de implementação, não decisão de UX (tarefas_tecnicas_frontend.md,
// Épico FE-2, tarefa 1).
//
// "Enviada" é aproximado por `!isDraft`: a API ainda não tem um endpoint de
// envio (Épico FE-7) nem um status dedicado, e `isDraft` já é a única
// sinalização de que a atividade deixou de ser rascunho.
async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const turmas = await turmasService.listClasses();

  if (turmas.length === 0) {
    return {
      turmasCount: 0,
      alunosCount: 0,
      atividadesCount: 0,
      atividadesEnviadasCount: 0,
      turmas: [],
      recentActivities: [],
    };
  }

  const [studentsPerClass, activitiesPerClass] = await Promise.all([
    Promise.all(turmas.map((turma) => turmasService.listClassStudents(turma.id))),
    Promise.all(turmas.map((turma) => turmasService.listClassActivities(turma.id))),
  ]);

  const turmaSummaries: DashboardTurmaSummary[] = turmas.map((turma, index) => ({
    id: turma.id,
    name: turma.name,
    studentCount: studentsPerClass[index]?.length ?? 0,
  }));

  const alunosCount = studentsPerClass.reduce((sum, students) => sum + students.length, 0);

  const allActivities: DashboardActivity[] = turmas.flatMap((turma, index) =>
    (activitiesPerClass[index] ?? []).map((activity) => ({
      id: activity.id,
      title: activity.title,
      classId: turma.id,
      className: turma.name,
      createdAt: activity.createdAt,
      isDraft: activity.isDraft,
    })),
  );

  const recentActivities = [...allActivities]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  return {
    turmasCount: turmas.length,
    alunosCount,
    atividadesCount: allActivities.length,
    atividadesEnviadasCount: allActivities.filter((activity) => !activity.isDraft).length,
    turmas: turmaSummaries,
    recentActivities,
  };
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: fetchDashboardSummary,
  });
}
