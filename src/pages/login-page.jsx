import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';

import AuthCard from '../components/auth/auth-card.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { supabase } from '../lib/supabase.js';

/**
 * LoginPage 컴포넌트
 * 이메일/비밀번호 로그인.
 *
 * Props: 없음
 *
 * Example usage:
 * <LoginPage />
 */
function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectTo = location.state?.from ?? '/guestbook';

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(error.message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 올바르지 않아요.' : error.message);
    }
  };

  return (
    <AuthCard title="로그인" subtitle="다시 만나서 반가워요!">
      <Box component="form" onSubmit={ handleSubmit } sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
        { errorMessage && <Alert severity="error" sx={ { borderRadius: 3 } }>{ errorMessage }</Alert> }
        <TextField label="이메일" type="email" autoComplete="email" required fullWidth value={ email } onChange={ (event) => setEmail(event.target.value) } />
        <TextField label="비밀번호" type="password" autoComplete="current-password" required fullWidth value={ password } onChange={ (event) => setPassword(event.target.value) } />
        <Button type="submit" variant="contained" size="large" disabled={ isSubmitting }>
          { isSubmitting ? '로그인 중...' : '로그인' }
        </Button>
        <Box sx={ { textAlign: 'center', color: 'text.secondary', fontSize: '0.9rem' } }>
          아직 회원이 아니신가요?{ ' ' }
          <Link component={ RouterLink } to="/signup" state={ location.state } underline="hover">회원가입</Link>
        </Box>
      </Box>
    </AuthCard>
  );
}

export default LoginPage;
