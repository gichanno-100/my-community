import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import EmptyState from '../components/ui/empty-state.jsx';
import LoadingState from '../components/ui/loading-state.jsx';
import PostCard from '../components/post/post-card.jsx';
import ProfileCard from '../components/profile/profile-card.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { formatDate } from '../utils/format-date.js';
import { fetchLikedPosts, fetchMyComments, fetchMyPosts, updateNickname } from '../utils/guestbook-api.js';

/**
 * MyPage 컴포넌트
 * 내 프로필, 내가 쓴 방명록/댓글, 좋아요한 글.
 *
 * Props: 없음
 *
 * Example usage:
 * <RequireAuth><MyPage /></RequireAuth>
 */
function MyPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [tab, setTab] = useState(0);
  const [activity, setActivity] = useState({ posts: [], comments: [], likedPosts: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;
    Promise.all([fetchMyPosts(user.id), fetchMyComments(user.id), fetchLikedPosts(user.id)])
      .then(([posts, comments, likedPosts]) => !isCancelled && setActivity({ posts, comments, likedPosts }))
      .catch((error) => !isCancelled && setErrorMessage(error.message))
      .finally(() => !isCancelled && setIsLoading(false));
    return () => {
      isCancelled = true;
    };
  }, [user]);

  const handleSaveNickname = async (nickname) => {
    await updateNickname(user.id, nickname);
    await refreshProfile();
  };

  const tabs = [
    { label: `내 방명록 ${activity.posts.length}` },
    { label: `내 댓글 ${activity.comments.length}` },
    { label: `좋아요 ${activity.likedPosts.length}` },
  ];

  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (errorMessage) return <EmptyState message={ `불러오지 못했어요: ${errorMessage}` } />;

    if (tab === 0) {
      if (activity.posts.length === 0) return <EmptyState message="아직 작성한 방명록이 없어요." />;
      return activity.posts.map((post) => <PostCard key={ post.id } post={ post } maxLines={ 3 } />);
    }

    if (tab === 1) {
      if (activity.comments.length === 0) return <EmptyState message="아직 작성한 댓글이 없어요." />;
      return activity.comments.map((comment) => (
        <Card key={ comment.id }>
          <CardActionArea component={ RouterLink } to={ `/posts/${comment.postId}` }>
            <CardContent sx={ { p: { xs: 2, md: 2.5 } } }>
              <Box sx={ { color: 'text.secondary', fontSize: '0.8rem', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }>
                원글: { comment.postContent }
              </Box>
              <Box sx={ { whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6 } }>{ comment.content }</Box>
              <Box sx={ { color: 'text.secondary', fontSize: '0.75rem', mt: 1 } }>{ formatDate(comment.createdAt) }</Box>
            </CardContent>
          </CardActionArea>
        </Card>
      ));
    }

    if (activity.likedPosts.length === 0) return <EmptyState message="아직 좋아요 누른 글이 없어요." />;
    return activity.likedPosts.map((post) => <PostCard key={ post.id } post={ post } isLiked maxLines={ 3 } />);
  };

  return (
    <Box>
      <Typography component="h1" sx={ { fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 700, lineHeight: 1.3, mb: 3 } }>
        내 활동
      </Typography>

      { profile && (
        <Box sx={ { mb: 3 } }>
          <ProfileCard key={ profile.nickname } profile={ profile } email={ user.email } onSaveNickname={ handleSaveNickname } />
        </Box>
      ) }

      <Tabs value={ tab } onChange={ (_event, value) => setTab(value) } variant="fullWidth" sx={ { mb: 2, borderBottom: 1, borderColor: 'divider' } }>
        { tabs.map((item) => <Tab key={ item.label } label={ item.label } />) }
      </Tabs>

      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>{ renderContent() }</Box>
    </Box>
  );
}

export default MyPage;
