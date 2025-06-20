
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/AdminLayout";
import Dashboard from "@/components/Dashboard";
import AdminDashboard from "@/components/AdminDashboard";
import AttendanceModule from "@/components/AttendanceModule";
import MarksModule from "@/components/MarksModule";
import ProfileModule from "@/components/ProfileModule";
import AdminModule from "@/components/AdminModule";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'admin' | 'student' }) {
  const { user, userRole, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/'} replace />;
  }
  
  if (userRole === 'admin') {
    return <AdminLayout>{children}</AdminLayout>;
  }
  
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute requiredRole="admin">
          <AdminModule />
        </ProtectedRoute>
      } />
      <Route path="/admin/attendance" element={
        <ProtectedRoute requiredRole="admin">
          <AttendanceModule />
        </ProtectedRoute>
      } />
      <Route path="/admin/marks" element={
        <ProtectedRoute requiredRole="admin">
          <MarksModule />
        </ProtectedRoute>
      } />
      <Route path="/admin/timetable" element={
        <ProtectedRoute requiredRole="admin">
          <div>Admin Timetable Management - Coming Soon</div>
        </ProtectedRoute>
      } />
      <Route path="/admin/papers" element={
        <ProtectedRoute requiredRole="admin">
          <div>Admin Previous Papers Management - Coming Soon</div>
        </ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute requiredRole="admin">
          <div>Admin Notifications Management - Coming Soon</div>
        </ProtectedRoute>
      } />
      <Route path="/admin/grievances" element={
        <ProtectedRoute requiredRole="admin">
          <div>Admin Grievances Management - Coming Soon</div>
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute requiredRole="admin">
          <ProfileModule />
        </ProtectedRoute>
      } />

      {/* Student Routes */}
      <Route path="/" element={
        <ProtectedRoute requiredRole="student">
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/attendance" element={
        <ProtectedRoute requiredRole="student">
          <AttendanceModule />
        </ProtectedRoute>
      } />
      <Route path="/marks" element={
        <ProtectedRoute requiredRole="student">
          <MarksModule />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute requiredRole="student">
          <ProfileModule />
        </ProtectedRoute>
      } />
      <Route path="/timetable" element={
        <ProtectedRoute requiredRole="student">
          <div>Timetable Module - Coming Soon</div>
        </ProtectedRoute>
      } />
      <Route path="/papers" element={
        <ProtectedRoute requiredRole="student">
          <div>Previous Papers Module - Coming Soon</div>
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute requiredRole="student">
          <div>Notifications Module - Coming Soon</div>
        </ProtectedRoute>
      } />
      <Route path="/feedback" element={
        <ProtectedRoute requiredRole="student">
          <div>Feedback & Grievance Module - Coming Soon</div>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to={userRole === 'admin' ? '/admin' : '/'} replace />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
