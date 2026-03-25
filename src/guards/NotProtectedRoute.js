import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const NotProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export default NotProtectedRoute;
