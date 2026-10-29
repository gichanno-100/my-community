import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import CommentItem from '../components/post/comment-item.jsx';
import ConfirmDialog from '../components/ui/confirm-dialog.jsx';
import EmptyState from '../components/ui/empty-state.jsx';
import LikeButton from '../components/post/like-button.jsx';
import LoadingState from '../components/ui/loading-state.jsx';
import PostForm from '../components/post/post-form.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { formatDate } from '../utils/format-date.js';
import {
  createComment,
  deleteComment,
  deletePost,
  fetchComments,
  fetchLikedPostIds,
  fetchPost,
  toggleLike,
  updateComment,
  updatePost,
} from '../utils/guestbook-api.js';

/**
 * PostDetailPage 컴포넌트
 * 게시글 전체 내용, 좋아요, 댓글, 본인 글 수정/삭제.
 *
 * Props: 없음 (URL 파라미터 postId 사용)
 *
 * Example usage:
 * <Route path="/posts/:postId" element={ <PostDetailPage /> } />
 */
function PostDetailPage() {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isOwner = Boolean(user && post && user.id === post.authorId);

  const loadPost = useCallback(async () => {
    try {
      const [postData, commentList, likedIds] = await Promise.all([
        fetchPost(postId),
        fetchComments(postId),
        fetchLikedPostIds(user?.id, [postId]),
      ]);
      setPost(postData);
      setComments(commentList);
      setIsLiked(likedIds.has(postId));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [postId, user]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const requireLogin = () => {
    navigate('/login', { state: { from: `/posts/${postId}` } });
  };

  const handleToggleLike = async () => {
    if (!user) {
      requireLogin();
      return;
    }
    setIsLiking(true);
    try {
      await toggleLike(user.id, postId, isLiked);
      setIsLiked(!isLiked);
      setPost((prev) => ({ ...prev, likeCount: prev.likeCount + (isLiked ? -1 : 1) }));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLiking(false);
    }
  };

  const handleUpdatePost = async (content) => {
    await updatePost(postId, content);
    setIsEditing(false);
    await loadPost();
  };

  const handleCreateComment = async (content) => {
    await createComment(user.id, postId, content);
    await loadPost();
  };

  const handleUpdateComment = async (commentId, content) => {
    await updateComment(commentId, content);
    await loadPost();
  };

  const handleConfirmDelete = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      if (target.type === 'post') {
        await deletePost(postId);
        navigate('/guestbook', { replace: true });
        return;
      }
      await deleteComment(target.id);
      await loadPost();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (isLoading) return <LoadingState />;
  if (!post) {
    return (
      <EmptyState message={ errorMessage ? `불러오지 못했어요: ${errorMessage}` : '삭제되었거나 존재하지 않는 글이에요.' }>
        <Button component={ RouterLink } to="/guestbook" variant="contained">방명록으로</Button>
      </EmptyState>
    );
  }

  const isEdited = post.updatedAt !== post.createdAt;

  return (
    <Box>
      <Button component={ RouterLink } to="/guestbook" startIcon={ <ArrowBackIcon /> } color="inherit" sx={ { mb: 2 } }>
        방명록 목록
      </Button>

      { errorMessage && <Alert severity="error" sx={ { mb: 2, borderRadius: 3 } }>{ errorMessage }</Alert> }

      <Card sx={ { mb: 3 } }>
        <CardContent sx={ { p: { xs: 2.5, md: 4 } } }>
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 } }>
            <Avatar sx={ { bgcolor: 'primary.main' } }>{ post.authorName.slice(0, 1) }</Avatar>
            <Box sx={ { flex: 1, minWidth: 0 } }>
              <Box sx={ { fontWeight: 700 } }>{ post.authorName }</Box>
              <Box sx={ { color: 'text.secondary', fontSize: '0.85rem' } }>
                { formatDate(post.createdAt) }{ isEdited ? ` · 수정됨 ${formatDate(post.updatedAt)}` : '' }
              </Box>
            </Box>
          </Box>

          { isEditing ? (
            <PostForm
              initialValue={ post.content }
              minRows={ 6 }
              submitLabel="저장"
              isResetOnSubmit={ false }
              onSubmit={ handleUpdatePost }
              onCancel={ () => setIsEditing(false) }
            />
          ) : (
            <Box sx={ { whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, fontSize: { xs: '1rem', md: '1.1rem' } } }>
              { post.content }
            </Box>
          ) }

          <Divider sx={ { my: 3 } } />

          <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 } }>
            <LikeButton isLiked={ isLiked } count={ post.likeCount } isDisabled={ isLiking } onToggle={ handleToggleLike } />
            { isOwner && !isEditing && (
              <Box sx={ { display: 'flex', gap: 1 } }>
                <Button variant="outlined" onClick={ () => setIsEditing(true) }>수정</Button>
                <Button variant="outlined" color="error" onClick={ () => setDeleteTarget({ type: 'post' }) }>삭제</Button>
              </Box>
            ) }
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={ { p: { xs: 2.5, md: 4 } } }>
          <Typography component="h2" sx={ { fontSize: '1.15rem', fontWeight: 700, mb: 2 } }>
            댓글 { comments.length }
          </Typography>

          { user ? (
            <PostForm maxLength={ 500 } minRows={ 2 } placeholder="따뜻한 댓글을 남겨주세요." onSubmit={ handleCreateComment } />
          ) : (
            <Alert
              severity="info"
              sx={ { borderRadius: 3 } }
              action={ <Button color="inherit" size="small" onClick={ requireLogin }>로그인</Button> }
            >
              로그인 후 댓글을 남길 수 있어요.
            </Alert>
          ) }

          <Box sx={ { mt: 2 } }>
            { comments.length === 0 && (
              <Box sx={ { color: 'text.secondary', textAlign: 'center', py: 3 } }>첫 댓글을 남겨보세요.</Box>
            ) }
            { comments.map((comment) => (
              <CommentItem
                key={ comment.id }
                comment={ comment }
                isOwner={ user?.id === comment.authorId }
                onUpdate={ handleUpdateComment }
                onDelete={ (id) => setDeleteTarget({ type: 'comment', id }) }
              />
            )) }
          </Box>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={ Boolean(deleteTarget) }
        title={ deleteTarget?.type === 'post' ? '이 글을 삭제할까요?' : '이 댓글을 삭제할까요?' }
        message={ deleteTarget?.type === 'post' ? '글에 달린 댓글과 좋아요도 함께 삭제되며 되돌릴 수 없어요.' : '삭제한 댓글은 되돌릴 수 없어요.' }
        onConfirm={ handleConfirmDelete }
        onClose={ () => setDeleteTarget(null) }
      />
    </Box>
  );
}

export default PostDetailPage;
