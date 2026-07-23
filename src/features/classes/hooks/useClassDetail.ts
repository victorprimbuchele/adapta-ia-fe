import { useQuery } from "@tanstack/react-query";
import { classesService } from "../services/classesService";

// GET /turmas/:id sempre traz `students: []` (docs/API.md §9.4) — a lista
// real de alunos vem de GET /turmas/:id/alunos, buscada em paralelo aqui.
export function useClassDetail(classId: string | undefined) {
  const classQuery = useQuery({
    queryKey: ["class", classId],
    queryFn: () => classesService.getClassDetail(classId as string),
    enabled: Boolean(classId),
  });

  const studentsQuery = useQuery({
    queryKey: ["class", classId, "students"],
    queryFn: () => classesService.listClassStudents(classId as string),
    enabled: Boolean(classId),
  });

  return {
    classDetail: classQuery.data,
    students: studentsQuery.data,
    isPending: classQuery.isPending || studentsQuery.isPending,
    isError: classQuery.isError || studentsQuery.isError,
  };
}
