import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsService } from "../services/studentsService";
import type { StudentFormValues } from "../schemas/studentSchemas";

export function useEnrollStudent(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: StudentFormValues) => {
      const student = await studentsService.enrollStudent(classId, {
        name: values.name,
        email: values.email,
      });
      await studentsService.assignLearningProfile(student.id, values.learningProfileId);
      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class", classId, "students"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
