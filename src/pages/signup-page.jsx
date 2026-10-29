import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';

import AuthCard from '../components/auth/auth-card.jsx';
import PasswordField from '../components/auth/password-field.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { supabase } from '../lib/supabase.js';

/**
 * SignupPage 컴포넌트
 * 닉네임, 이메일, 비밀번호로 회원가입. 닉네임은 가입 시 profiles 테이블에 저장된다.
 *
 * Props: 없음
 *
 * Example usage:
 * <SignupPage />
 */
function SignupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  useEffect(() => {
    if (user) navigate(location.state?.from ?? '/guestbook', { replace: true });
  }, [user, navigate, location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isPasswordMismatch) return;
    setIsSubmitting(true);
    setErrorMessage('');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname: nickname.trim() },
        emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
      },
    });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    /** 이메일 인증이 켜져 있으면 세션 없이 응답이 온다 */
    if (!data.session) setIsEmailSent(true);
  };

  if (isEmailSent) {
    return (
      <AuthCard title="메일을 확인해주세요" subtitle={ `${email} 로 인증 메일을 보냈어요. 메일의 링크를 누르면 가입이 완료돼요.` }>
        <Button component={ RouterLink } to="/login" variant="contained" fullWidth size="large">로그인하러 가기</Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="회원가입" subtitle="닉네임을 정하고 이야기를 시작해보세요.">
      <Box component="form" onSubmit={ handleSubmit } sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
        { errorMessage && <Alert severity="error" sx={ { borderRadius: 3 } }>{ errorMessage }</Alert> }
        <TextField
          label="닉네임"
          required
          fullWidth
          value={ nickname }
          onChange={ (event) => setNickname(event.target.value) }
          slotProps={ { htmlInput: { maxLength: 30 } } }
          helperText="1~30자"
        />
        <TextField label="이메일" type="email" autoComplete="email" required fullWidth value={ email } onChange={ (event) => setEmail(event.target.value) } />
        <PasswordField
          label="비밀번호"
          autoComplete="new-password"
          required
          fullWidth
          value={ password }
          onChange={ (event) => setPassword(event.target.value) }
          slotProps={ { htmlInput: { minLength: 6 } } }
          helperText="6자 이상"
        />
        <PasswordField
          label="비밀번호 확인"
          autoComplete="new-password"
          required
          fullWidth
          value={ passwordConfirm }
          onChange={ (event) => setPasswordConfirm(event.target.value) }
          error={ isPasswordMismatch }
          helperText={ isPasswordMismatch ? '비밀번호가 일치하지 않아요.' : ' ' }
        />
        <Button type="submit" variant="contained" size="large" disabled={ isSubmitting || isPasswordMismatch || !nickname.trim() }>
          { isSubmitting ? '가입 중...' : '회원가입' }
        </Button>
        <Box sx={ { textAlign: 'center', color: 'text.secondary', fontSize: '0.9rem' } }>
          이미 회원이신가요?{ ' ' }
          <Link component={ RouterLink } to="/login" state={ location.state } underline="hover">로그인</Link>
        </Box>
      </Box>
    </AuthCard>
  );
}

export default SignupPage;
