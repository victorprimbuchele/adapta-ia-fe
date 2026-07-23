import { useQuery } from "@tanstack/react-query";
import { classesService } from "../services/classesService";
import type { Class, ClassStudentWithProfile } from "../../../types/class";

export interface ClassSummary extends Class {
  students: ClassStudentWithProfile[];
}

// GET /turmas não traz alunos (docs/API.md §9.4), então a contagem de
// alunos/perfis por turma (Épico FE-3, tarefa 7) é composta aqui a partir de
// GET /turmas/:id/alunos por turma — detalhe de implementação, não decisão
// de UX.
async function fetchClassSummaries(): Promise<ClassSummary[]> {
  const classes = await classesService.listClasses();
  const studentsPerClass = await Promise.all(
    classes.map((classItem) => classesService.listClassStudents(classItem.id)),
  );
  return classes.map((classItem, index) => ({ ...classItem, students: studentsPerClass[index] ?? [] }));
}

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: fetchClassSummaries,
  });
}
