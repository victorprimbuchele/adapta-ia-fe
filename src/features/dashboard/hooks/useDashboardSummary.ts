import { useQuery } from "@tanstack/react-query";
import { classesService } from "../../classes/services/classesService";

export interface DashboardClassSummary {
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
  classesCount: number;
  studentsCount: number;
  homeworksCount: number;
  homeworksSentCount: number;
  classes: DashboardClassSummary[];
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
  const classes = await classesService.listClasses();

  if (classes.length === 0) {
    return {
      classesCount: 0,
      studentsCount: 0,
      homeworksCount: 0,
      homeworksSentCount: 0,
      classes: [],
      recentActivities: [],
    };
  }

  const [studentsPerClass, activitiesPerClass] = await Promise.all([
    Promise.all(classes.map((classItem) => classesService.listClassStudents(classItem.id))),
    Promise.all(classes.map((classItem) => classesService.listClassActivities(classItem.id))),
  ]);

  const classSummaries: DashboardClassSummary[] = classes.map((classItem, index) => ({
    id: classItem.id,
    name: classItem.name,
    studentCount: studentsPerClass[index]?.length ?? 0,
  }));

  const studentsCount = studentsPerClass.reduce((sum, students) => sum + students.length, 0);

  const allActivities: DashboardActivity[] = classes.flatMap((classItem, index) =>
    (activitiesPerClass[index] ?? []).map((activity) => ({
      id: activity.id,
      title: activity.title,
      classId: classItem.id,
      className: classItem.name,
      createdAt: activity.createdAt,
      isDraft: activity.isDraft,
    })),
  );

  const recentActivities = [...allActivities]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  return {
    classesCount: classes.length,
    studentsCount,
    homeworksCount: allActivities.length,
    homeworksSentCount: allActivities.filter((activity) => !activity.isDraft).length,
    classes: classSummaries,
    recentActivities,
  };
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: fetchDashboardSummary,
  });
}
