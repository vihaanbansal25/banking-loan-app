import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// Wraps a section of routes that requires a logged-in user of a specific
// role. Not logged in -> straight to login. Logged in as the wrong role
// (e.g. a customer trying to open a manager URL) -> bounced to their own
// home instead of shown someone else's interface.
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  return children;
}
