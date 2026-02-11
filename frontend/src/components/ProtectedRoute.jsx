import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#718096' }}>
        加载中...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles !== user.role) {
    return <Navigate to={"/" + user.role} replace />
  }

  return children;
}
