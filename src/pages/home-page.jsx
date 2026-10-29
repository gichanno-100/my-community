import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import EmptyState from '../components/ui/empty-state.jsx';
import LoadingState from '../components/ui/loading-state.jsx';
import PostCard from '../components/post/post-card.jsx';
import { fetchPosts } from '../utils/guestbook-api.js';

const FEATURES = [
  { icon: <EditNoteIcon />, title: '이야기 남기기', text: '오늘의 일상과 안부를 짧게 기록해요.' },
  { icon: <ChatBubbleOutlinedIcon />, title: '댓글로 대화하기', text: '마음에 닿은 글에 따뜻한 한마디를 건네요.' },
  { icon: <FavoriteBorderIcon />, title: '좋아요로 공감하기', text: '말 대신 마음을 눌러 전해요.' },
];

/**
 * HomePage 컴포넌트
 * 환영 문구, 사이트 소개, 최근 방명록 미리보기.
 *
 * Props: 없음
 *
 * Example usage:
 * <HomePage />
 */
function HomePage() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;
    fetchPosts(3)
      .then((posts) => !isCancelled && setRecentPosts(posts))
      .catch((error) => !isCancelled && setErrorMessage(error.message))
      .finally(() => !isCancelled && setIsLoading(false));
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <Box>
      <Box sx={ { textAlign: 'center', py: { xs: 4, md: 8 } } }>
        <Typography
          component="h1"
          sx={ { fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, lineHeight: 1.3, mb: 2 } }
        >
          오늘의 이야기를<br />남겨주세요.
        </Typography>
        <Typography sx={ { color: 'text.secondary', fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.6, mb: 4 } }>
          My Guestbook은 작은 이야기를 남기는 따뜻한 공간이에요.
          <br />
          일상과 안부를 나누고, 댓글과 좋아요로 마음을 전해보세요.
        </Typography>
        <Button component={ RouterLink } to="/guestbook" state={ { isWriting: true } } variant="contained" size="large" startIcon={ <EditNoteIcon /> }>
          방명록 작성하기
        </Button>
      </Box>

      <Grid container spacing={ 2 } sx={ { mb: { xs: 5, md: 8 } } }>
        { FEATURES.map((feature) => (
          <Grid key={ feature.title } size={ { xs: 12, md: 4 } }>
            <Box sx={ { bgcolor: 'background.paper', borderRadius: 4, p: 3, height: '100%', boxShadow: '0 2px 12px rgba(41, 40, 35, 0.06)' } }>
              <Box sx={ { color: 'primary.main', mb: 1 } }>{ feature.icon }</Box>
              <Box sx={ { fontWeight: 700, mb: 0.5 } }>{ feature.title }</Box>
              <Box sx={ { color: 'text.secondary', fontSize: '0.9rem', lineHeight: 1.6 } }>{ feature.text }</Box>
            </Box>
          </Grid>
        )) }
      </Grid>

      <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 } }>
        <Typography component="h2" sx={ { fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 700 } }>
          최근 방명록
        </Typography>
        <Button component={ RouterLink } to="/guestbook">전체 보기</Button>
      </Box>

      { isLoading && <LoadingState /> }
      { !isLoading && errorMessage && <EmptyState message={ `불러오지 못했어요: ${errorMessage}` } /> }
      { !isLoading && !errorMessage && recentPosts.length === 0 && (
        <EmptyState message="아직 남겨진 이야기가 없어요. 첫 번째 이야기를 남겨주세요!" />
      ) }
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
        { recentPosts.map((post) => <PostCard key={ post.id } post={ post } maxLines={ 3 } />) }
      </Box>
    </Box>
  );
}

export default HomePage;
