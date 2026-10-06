import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import NotFound from './pages/NotFound';

import Dashboard from './pages/student/Dashboard';
import PersonalInfo from './pages/student/PersonalInfo';
import Academics from './pages/student/Academics';
import Report from './pages/student/Report';
import Placements from './pages/student/Placements';
import MyRequests from './pages/student/MyRequests';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRequests from './pages/admin/AdminRequests';
import StudentSearch from './pages/admin/StudentSearch';
import StudentReport from './pages/admin/StudentReport';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Student area */}
      <Route
        path="/app"
        element={
          <ProtectedRoute role="student">
            <Layout variant="student" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="personal" element={<PersonalInfo />} />
        <Route path="academics" element={<Academics />} />
        <Route path="report" element={<Report />} />
        <Route path="placements" element={<Placements />} />
        <Route path="requests" element={<MyRequests />} />
      </Route>

      {/* Admin area */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <Layout variant="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="students" element={<StudentSearch />} />
        <Route path="students/:id" element={<StudentReport />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
