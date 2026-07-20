import { Navigate, Route, Routes } from "react-router-dom";
import { LoginScreen } from "../features/auth/components/LoginScreen";
import { RegisterScreen } from "../features/auth/components/RegisterScreen";
import { DashboardScreen } from "../features/dashboard/components/DashboardScreen";
import { ProtectedRoute } from "../routes/ProtectedRoute";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
