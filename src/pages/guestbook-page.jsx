import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import EditNoteIcon from '@mui/icons-material/EditNote';

import EmptyState from '../components/ui/empty-state.jsx';
import LoadingState from '../components/ui/loading-state.jsx';
import PostCard from '../components/post/post-card.jsx';
import PostForm from '../components/post/post-form.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { createPost, fetchLikedPostIds, fetchPosts } from '../utils/guestbook-api.js';

/**
 * GuestbookPage 컴포넌트
 * 방명록 작성 폼과 최신순 게시글 목록.
 *
 * Props: 없음
 *
 * Example usage:
 * <GuestbookPage />
 */
function GuestbookPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isWriting, setIsWriting] = useState(Boolean(location.state?.isWriting));

  const loadPosts = useCallback(async () => {
    try {
      const list = await fetchPosts();
      setPosts(list);
      setLikedIds(await fetchLikedPostIds(user?.id, list.map((post) => post.id)));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleWriteClick = () => {
    if (!user) {
      navigate('/login', { state: { from: '/guestbook' } });
      return;
    }
    setIsWriting((prev) => !prev);
  };

  const handleCreate = async (content) => {
    await createPost(user.id, content);
    setIsWriting(false);
    await loadPosts();
  };

  return (
    <Box>
      <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 } }>
        <Box>
          <Typography component="h1" sx={ { fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 700, lineHeight: 1.3 } }>
            방명록
          </Typography>
          <Box sx={ { color: 'text.secondary', mt: 0.5 } }>{ posts.length }개의 이야기</Box>
        </Box>
        <Button variant={ isWriting ? 'outlined' : 'contained' } startIcon={ <EditNoteIcon /> } onClick={ handleWriteClick }>
          { isWriting ? '닫기' : '글쓰기' }
        </Button>
      </Box>

      { !user && (
        <Alert severity="info" sx={ { mb: 3, borderRadius: 3 } }>
          로그인하면 방명록을 작성하고 댓글과 좋아요를 남길 수 있어요.
        </Alert>
      ) }

      <Collapse in={ Boolean(user) && isWriting } unmountOnExit>
        <Card sx={ { mb: 3 } }>
          <CardContent sx={ { p: { xs: 2, md: 3 } } }>
            <PostForm onSubmit={ handleCreate } onCancel={ () => setIsWriting(false) } />
          </CardContent>
        </Card>
      </Collapse>

      { isLoading && <LoadingState /> }
      { !isLoading && errorMessage && <EmptyState message={ `불러오지 못했어요: ${errorMessage}` } /> }
      { !isLoading && !errorMessage && posts.length === 0 && (
        <EmptyState message="아직 남겨진 이야기가 없어요. 첫 번째 이야기를 남겨주세요!" />
      ) }
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
        { posts.map((post) => <PostCard key={ post.id } post={ post } isLiked={ likedIds.has(post.id) } />) }
      </Box>
    </Box>
  );
}

export default GuestbookPage;
