import { useMutation, useQueryClient } from "@tanstack/react-query";
import { alunosService } from "../services/alunosService";
import type { AlunoFormValues } from "../schemas/alunoSchemas";

export function useEnrollStudent(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: AlunoFormValues) => {
      const student = await alunosService.enrollStudent(classId, {
        name: values.name,
        email: values.email,
      });
      await alunosService.assignLearningProfile(student.id, values.learningProfileId);
      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turma", classId, "alunos"] });
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
