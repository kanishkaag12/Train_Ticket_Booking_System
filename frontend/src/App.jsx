import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import BookingFlowPage from "./pages/BookingFlowPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import AdminPage from "./pages/AdminPage";
import { useAuth } from "./hooks/useAuth";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && user.role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <AppLayout>
            <SearchPage />
          </AppLayout>
        }
      />
      <Route
        path="/book/:trainId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BookingFlowPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyTicketsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AppLayout>
              <AdminPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
