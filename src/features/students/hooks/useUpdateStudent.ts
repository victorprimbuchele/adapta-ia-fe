import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsService } from "../services/studentsService";
import type { StudentFormValues } from "../schemas/studentSchemas";

export function useUpdateStudent(classId: string, studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: StudentFormValues) => {
      const student = await studentsService.updateStudent(classId, studentId, {
        name: values.name,
        email: values.email,
      });
      await studentsService.assignLearningProfile(studentId, values.learningProfileId);
      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class", classId, "students"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}
