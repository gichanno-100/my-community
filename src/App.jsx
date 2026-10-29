import { Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Footer from './components/common/footer.jsx';
import Header from './components/common/header.jsx';
import RequireAuth from './components/common/require-auth.jsx';
import GuestbookPage from './pages/guestbook-page.jsx';
import HomePage from './pages/home-page.jsx';
import LoginPage from './pages/login-page.jsx';
import MyPage from './pages/my-page.jsx';
import PostDetailPage from './pages/post-detail-page.jsx';
import SignupPage from './pages/signup-page.jsx';

/**
 * App 컴포넌트
 * 공통 레이아웃(헤더/푸터)과 페이지 라우팅.
 *
 * Props: 없음
 *
 * Example usage:
 * <App />
 */
function App() {
  return (
    <Box sx={ { width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' } }>
      <Header />
      <Box
        component="main"
        sx={ {
          width: '100%',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 2, md: 4 },
        } }
      >
        <Container maxWidth="md" sx={ { py: 4, px: { xs: 2, md: 3 } } }>
          <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/guestbook" element={ <GuestbookPage /> } />
            <Route path="/posts/:postId" element={ <PostDetailPage /> } />
            <Route path="/login" element={ <LoginPage /> } />
            <Route path="/signup" element={ <SignupPage /> } />
            <Route path="/me" element={ <RequireAuth><MyPage /></RequireAuth> } />
            <Route path="*" element={ <Navigate to="/" replace /> } />
          </Routes>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
