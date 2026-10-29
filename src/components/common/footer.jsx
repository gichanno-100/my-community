import Box from '@mui/material/Box';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <Footer />
 */
function Footer() {
  return (
    <Box component="footer" sx={ { py: 3, textAlign: 'center', color: 'text.secondary', fontSize: '0.85rem', borderTop: 1, borderColor: 'divider' } }>
      © { CURRENT_YEAR } My Guestbook · 작은 이야기를 남기는 따뜻한 공간
    </Box>
  );
}

export default Footer;
