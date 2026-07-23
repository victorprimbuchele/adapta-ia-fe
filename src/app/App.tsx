import { Navigate, Route, Routes } from "react-router-dom";
import { StudentEditScreen } from "../features/students/components/StudentEditScreen";
import { StudentNewScreen } from "../features/students/components/StudentNewScreen";
import { HomeworkDeliveryScreen } from "../features/homeworks/components/HomeworkDeliveryScreen";
import { HomeworkNewScreen } from "../features/homeworks/components/HomeworkNewScreen";
import { HomeworkProcessingScreen } from "../features/homeworks/components/HomeworkProcessingScreen";
import { HomeworkReviewScreen } from "../features/homeworks/components/HomeworkReviewScreen";
import { LoginScreen } from "../features/auth/components/LoginScreen";
import { RegisterScreen } from "../features/auth/components/RegisterScreen";
import { DashboardScreen } from "../features/dashboard/components/DashboardScreen";
import { ClassDetailScreen } from "../features/classes/components/ClassDetailScreen";
import { ClassEditScreen } from "../features/classes/components/ClassEditScreen";
import { ClassNewScreen } from "../features/classes/components/ClassNewScreen";
import { ClassesScreen } from "../features/classes/components/ClassesScreen";
import { ProtectedRoute } from "../routes/ProtectedRoute";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/turmas" element={<ClassesScreen />} />
        <Route path="/turmas/nova" element={<ClassNewScreen />} />
        <Route path="/turmas/:id" element={<ClassDetailScreen />} />
        <Route path="/turmas/:id/editar" element={<ClassEditScreen />} />
        <Route path="/turmas/:id/alunos/novo" element={<StudentNewScreen />} />
        <Route path="/turmas/:id/alunos/:studentId/editar" element={<StudentEditScreen />} />
        <Route path="/atividades/nova" element={<HomeworkNewScreen />} />
        <Route path="/atividades/:id/processando" element={<HomeworkProcessingScreen />} />
        <Route path="/atividades/:id/revisao" element={<HomeworkReviewScreen />} />
        <Route path="/atividades/:id/envio/:deliveryId" element={<HomeworkDeliveryScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
