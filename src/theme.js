import { createTheme } from '@mui/material/styles';

/**
 * My Guestbook 테마
 * - 메인: 세이지 그린 / 배경: 아이보리 / 글자: 차콜 / 카드: 화이트
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#4F725F',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F6F3ED',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#292823',
      secondary: '#6B6A62',
    },
    divider: '#E6E1D6',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Roboto", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  spacing: 8,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(41, 40, 35, 0.06)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
  },
});

export default theme;
