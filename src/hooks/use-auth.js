import { useContext } from 'react';

import { AuthContext } from '../contexts/auth-context.js';

/**
 * 로그인 상태를 가져오는 훅
 * @returns {{ user: object|null, profile: object|null, isLoading: boolean, refreshProfile: function, signOut: function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
}
