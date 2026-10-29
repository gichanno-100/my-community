import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { formatDate } from '../../utils/format-date.js';

/**
 * PostCard 컴포넌트
 * 게시글 목록의 카드 한 장. 클릭하면 상세 페이지로 이동한다.
 *
 * Props:
 * @param {object} post - 게시글 { id, authorName, content, createdAt, likeCount, commentCount } [Required]
 * @param {boolean} isLiked - 내가 좋아요 눌렀는지 여부 [Optional, 기본값: false]
 * @param {number} maxLines - 본문 미리보기 최대 줄 수 [Optional, 기본값: 4]
 *
 * Example usage:
 * <PostCard post={ post } isLiked />
 */
function PostCard({ post, isLiked = false, maxLines = 4 }) {
  return (
    <Card>
      <CardActionArea component={ RouterLink } to={ `/posts/${post.id}` }>
        <CardContent sx={ { p: { xs: 2, md: 3 } } }>
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 } }>
            <Avatar sx={ { width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.95rem' } }>
              { post.authorName.slice(0, 1) }
            </Avatar>
            <Box sx={ { minWidth: 0 } }>
              <Box sx={ { fontWeight: 600, fontSize: '0.95rem' } }>{ post.authorName }</Box>
              <Box sx={ { color: 'text.secondary', fontSize: '0.8rem' } }>{ formatDate(post.createdAt) }</Box>
            </Box>
          </Box>

          <Box
            sx={ {
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.6,
              fontSize: { xs: '0.95rem', md: '1rem' },
              display: '-webkit-box',
              WebkitLineClamp: maxLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } }
          >
            { post.content }
          </Box>

          <Box sx={ { display: 'flex', gap: 2, mt: 2, color: 'text.secondary', fontSize: '0.85rem' } }>
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.5 } }>
              { isLiked
                ? <FavoriteIcon fontSize="small" sx={ { color: '#C8665B' } } />
                : <FavoriteBorderIcon fontSize="small" /> }
              { post.likeCount }
            </Box>
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.5 } }>
              <ChatBubbleOutlinedIcon fontSize="small" />
              { post.commentCount }
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default PostCard;
