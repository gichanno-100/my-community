import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import EditNoteIcon from '@mui/icons-material/EditNote';

import { useAuth } from '../../hooks/use-auth.js';

/**
 * Header 컴포넌트
 * 사이트 로고와 상단 메뉴. 로그인 상태에 따라 메뉴가 바뀐다.
 *
 * Props: 없음
 *
 * Example usage:
 * <Header />
 */
function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAnchor, setMenuAnchor] = useState(null);

  const menuItems = user
    ? [
      { label: '홈', to: '/' },
      { label: '방명록', to: '/guestbook' },
      { label: '내 활동', to: '/me' },
    ]
    : [
      { label: '홈', to: '/' },
      { label: '방명록', to: '/guestbook' },
      { label: '로그인', to: '/login' },
      { label: '회원가입', to: '/signup' },
    ];

  const handleSignOut = async () => {
    setMenuAnchor(null);
    await signOut();
    navigate('/');
  };

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <AppBar
      position="sticky"
      elevation={ 0 }
      sx={ { bgcolor: 'rgba(246, 243, 237, 0.92)', backdropFilter: 'blur(8px)', color: 'text.primary', borderBottom: 1, borderColor: 'divider' } }
    >
      <Container maxWidth="md" sx={ { px: { xs: 2, md: 3 } } }>
        <Toolbar disableGutters sx={ { gap: 1 } }>
          <Box
            component={ RouterLink }
            to="/"
            sx={ { display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', textDecoration: 'none', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.25rem' }, flexGrow: 1 } }
          >
            <EditNoteIcon />
            My Guestbook
          </Box>

          <Box sx={ { display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 } }>
            { menuItems.map((item) => (
              <Button
                key={ item.to }
                component={ RouterLink }
                to={ item.to }
                variant={ item.to === '/signup' ? 'contained' : 'text' }
                color={ item.to === '/signup' || isActive(item.to) ? 'primary' : 'inherit' }
                sx={ { fontWeight: isActive(item.to) ? 700 : 500 } }
              >
                { item.label }
              </Button>
            )) }
            { user && (
              <Button color="inherit" onClick={ handleSignOut }>
                로그아웃{ profile?.nickname ? ` (${profile.nickname})` : '' }
              </Button>
            ) }
          </Box>

          <IconButton
            aria-label="메뉴 열기"
            onClick={ (event) => setMenuAnchor(event.currentTarget) }
            sx={ { display: { xs: 'inline-flex', sm: 'none' } } }
          >
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={ menuAnchor } open={ Boolean(menuAnchor) } onClose={ () => setMenuAnchor(null) }>
            { menuItems.map((item) => (
              <MenuItem
                key={ item.to }
                component={ RouterLink }
                to={ item.to }
                selected={ isActive(item.to) }
                onClick={ () => setMenuAnchor(null) }
              >
                { item.label }
              </MenuItem>
            )) }
            { user && <MenuItem onClick={ handleSignOut }>로그아웃</MenuItem> }
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
