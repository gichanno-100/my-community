import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import PostForm from './post-form.jsx';
import { formatDate } from '../../utils/format-date.js';

/**
 * CommentItem 컴포넌트
 * 댓글 한 개. 본인 댓글이면 수정/삭제 버튼을 보여준다.
 *
 * Props:
 * @param {object} comment - 댓글 { id, authorName, content, createdAt, updatedAt } [Required]
 * @param {boolean} isOwner - 본인 댓글 여부 [Optional, 기본값: false]
 * @param {function} onUpdate - 수정 저장 시 실행 (id, content) => Promise [Optional]
 * @param {function} onDelete - 삭제 클릭 시 실행 (id) [Optional]
 *
 * Example usage:
 * <CommentItem comment={ comment } isOwner onUpdate={ handleUpdate } onDelete={ handleDelete } />
 */
function CommentItem({ comment, isOwner = false, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const isEdited = comment.updatedAt && comment.updatedAt !== comment.createdAt;

  const handleUpdate = async (content) => {
    await onUpdate(comment.id, content);
    setIsEditing(false);
  };

  return (
    <Box sx={ { display: 'flex', gap: 1.5, py: 2, borderBottom: 1, borderColor: 'divider', '&:last-of-type': { borderBottom: 0 } } }>
      <Avatar sx={ { width: 32, height: 32, bgcolor: 'primary.light', fontSize: '0.85rem' } }>
        { comment.authorName.slice(0, 1) }
      </Avatar>
      <Box sx={ { flex: 1, minWidth: 0 } }>
        <Box sx={ { display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' } }>
          <Box sx={ { fontWeight: 600, fontSize: '0.9rem' } }>{ comment.authorName }</Box>
          <Box sx={ { color: 'text.secondary', fontSize: '0.75rem' } }>
            { formatDate(comment.createdAt) }{ isEdited ? ' · 수정됨' : '' }
          </Box>
        </Box>

        { isEditing ? (
          <Box sx={ { mt: 1 } }>
            <PostForm
              initialValue={ comment.content }
              maxLength={ 500 }
              minRows={ 2 }
              submitLabel="저장"
              isResetOnSubmit={ false }
              onSubmit={ handleUpdate }
              onCancel={ () => setIsEditing(false) }
            />
          </Box>
        ) : (
          <Box sx={ { mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6, fontSize: '0.95rem' } }>
            { comment.content }
          </Box>
        ) }

        { isOwner && !isEditing && (
          <Box sx={ { display: 'flex', gap: 0.5, mt: 0.5, ml: -1 } }>
            <Button size="small" color="inherit" onClick={ () => setIsEditing(true) }>수정</Button>
            <Button size="small" color="error" onClick={ () => onDelete(comment.id) }>삭제</Button>
          </Box>
        ) }
      </Box>
    </Box>
  );
}

export default CommentItem;
