import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (role && user.role !== role) {
    // Logged in but wrong area — send to their own home.
    return <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace />;
  }

  return children;
}
