import { useCallback, useEffect, useMemo, useState } from 'react';

import { AuthContext } from './auth-context.js';
import { supabase } from '../lib/supabase.js';

/**
 * AuthProvider 컴포넌트
 * Supabase Auth 세션을 구독하고, 로그인한 회원의 profiles 정보를 함께 제공한다.
 *
 * Props:
 * @param {node} children - 하위 컴포넌트 [Required]
 *
 * Example usage:
 * <AuthProvider><App /></AuthProvider>
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url, created_at')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      loadProfile(sessionUser?.id).finally(() => setIsLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      /** onAuthStateChange 콜백 안에서 바로 쿼리하면 교착될 수 있어 다음 틱에서 조회 */
      setTimeout(() => loadProfile(sessionUser?.id), 0);
    });

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const refreshProfile = useCallback(() => loadProfile(user?.id), [loadProfile, user]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ user, profile, isLoading, refreshProfile, signOut }),
    [user, profile, isLoading, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
}

export default AuthProvider;
