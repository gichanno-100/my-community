import { createClient } from '@supabase/supabase-js';

/**
 * HashRouter 와 충돌하지 않도록 인증 콜백을 쿼리(?code=) 방식인 PKCE 로 받는다.
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { flowType: 'pkce' } },
);
