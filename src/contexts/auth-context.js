import { createContext } from 'react';

/**
 * 로그인 상태 공유용 Context
 * 값: { user, profile, isLoading, refreshProfile, signOut }
 */
export const AuthContext = createContext(null);
