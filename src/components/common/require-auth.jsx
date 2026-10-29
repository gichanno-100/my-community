import { Navigate, useLocation } from 'react-router-dom';

import LoadingState from '../ui/loading-state.jsx';
import { useAuth } from '../../hooks/use-auth.js';

/**
 * RequireAuth 컴포넌트
 * 로그인하지 않은 사용자는 로그인 페이지로 보낸다.
 *
 * Props:
 * @param {node} children - 로그인 후에만 보여줄 내용 [Required]
 *
 * Example usage:
 * <RequireAuth><MyPage /></RequireAuth>
 */
function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingState />;
  if (!user) return <Navigate to="/login" replace state={ { from: location.pathname } } />;
  return children;
}

export default RequireAuth;
