import { useQuery } from "@tanstack/react-query";
import { turmasService } from "../services/turmasService";
import type { Class, ClassStudentWithProfile } from "../../../types/class";

export interface TurmaResumo extends Class {
  students: ClassStudentWithProfile[];
}

// GET /turmas não traz alunos (docs/API.md §9.4), então a contagem de
// alunos/perfis por turma (Épico FE-3, tarefa 7) é composta aqui a partir de
// GET /turmas/:id/alunos por turma — detalhe de implementação, não decisão
// de UX.
async function fetchTurmasResumo(): Promise<TurmaResumo[]> {
  const turmas = await turmasService.listClasses();
  const studentsPerClass = await Promise.all(
    turmas.map((turma) => turmasService.listClassStudents(turma.id)),
  );
  return turmas.map((turma, index) => ({ ...turma, students: studentsPerClass[index] ?? [] }));
}

export function useTurmas() {
  return useQuery({
    queryKey: ["turmas"],
    queryFn: fetchTurmasResumo,
  });
}
