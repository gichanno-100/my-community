import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

/**
 * PostForm 컴포넌트
 * 게시글/댓글 작성·수정에 함께 쓰는 입력 폼.
 *
 * Props:
 * @param {string} initialValue - 처음 입력값 [Optional, 기본값: '']
 * @param {number} maxLength - 최대 글자 수 [Optional, 기본값: 2000]
 * @param {number} minRows - 입력창 최소 줄 수 [Optional, 기본값: 4]
 * @param {string} placeholder - 안내 문구 [Optional, 기본값: '오늘의 이야기를 남겨주세요.']
 * @param {string} submitLabel - 제출 버튼 텍스트 [Optional, 기본값: '등록']
 * @param {boolean} isResetOnSubmit - 제출 성공 후 입력창 비우기 [Optional, 기본값: true]
 * @param {function} onSubmit - 제출 시 실행, 내용(string)을 받는 async 함수 [Required]
 * @param {function} onCancel - 취소 버튼 클릭 시 실행 (없으면 버튼 숨김) [Optional]
 *
 * Example usage:
 * <PostForm onSubmit={ handleCreate } />
 */
function PostForm({
  initialValue = '',
  maxLength = 2000,
  minRows = 4,
  placeholder = '오늘의 이야기를 남겨주세요.',
  submitLabel = '등록',
  isResetOnSubmit = true,
  onSubmit,
  onCancel,
}) {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const trimmed = content.trim();
  const isInvalid = trimmed.length === 0 || content.length > maxLength;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isInvalid) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await onSubmit(trimmed);
      if (isResetOnSubmit) setContent('');
    } catch (error) {
      setErrorMessage(error.message ?? '저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={ handleSubmit }>
      <TextField
        fullWidth
        multiline
        minRows={ minRows }
        value={ content }
        onChange={ (event) => setContent(event.target.value) }
        placeholder={ placeholder }
        error={ Boolean(errorMessage) || content.length > maxLength }
        helperText={ errorMessage || `${content.length} / ${maxLength}` }
        slotProps={ { htmlInput: { maxLength } } }
        sx={ { '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } } }
      />
      <Box sx={ { display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 } }>
        { onCancel && (
          <Button color="inherit" onClick={ onCancel } disabled={ isSubmitting }>
            취소
          </Button>
        ) }
        <Button type="submit" variant="contained" disabled={ isInvalid || isSubmitting }>
          { isSubmitting ? '저장 중...' : submitLabel }
        </Button>
      </Box>
    </Box>
  );
}

export default PostForm;
