import { useMutation, useQueryClient } from "@tanstack/react-query";
import { alunosService } from "../services/alunosService";
import type { AlunoFormValues } from "../schemas/alunoSchemas";

export function useUpdateStudent(classId: string, studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: AlunoFormValues) => {
      const student = await alunosService.updateStudent(classId, studentId, {
        name: values.name,
        email: values.email,
      });
      await alunosService.assignLearningProfile(studentId, values.learningProfileId);
      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turma", classId, "alunos"] });
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
    },
  });
}
