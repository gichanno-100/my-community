import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

/**
 * AuthCard 컴포넌트
 * 로그인/회원가입 화면의 공통 카드 레이아웃.
 *
 * Props:
 * @param {string} title - 카드 제목 [Required]
 * @param {string} subtitle - 제목 아래 안내 문구 [Optional]
 * @param {node} children - 폼 내용 [Required]
 *
 * Example usage:
 * <AuthCard title="로그인">...</AuthCard>
 */
function AuthCard({ title, subtitle, children }) {
  return (
    <Box sx={ { maxWidth: 420, mx: 'auto', width: '100%' } }>
      <Card>
        <CardContent sx={ { p: { xs: 3, md: 4 } } }>
          <Typography component="h1" sx={ { fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, textAlign: 'center' } }>
            { title }
          </Typography>
          { subtitle && (
            <Typography sx={ { color: 'text.secondary', textAlign: 'center', mt: 1, mb: 3, lineHeight: 1.5 } }>
              { subtitle }
            </Typography>
          ) }
          { children }
        </CardContent>
      </Card>
    </Box>
  );
}

export default AuthCard;
