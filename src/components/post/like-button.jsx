import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

/**
 * LikeButton 컴포넌트
 * 좋아요 토글 버튼. 다시 누르면 취소된다.
 *
 * Props:
 * @param {boolean} isLiked - 좋아요 상태 [Required]
 * @param {number} count - 좋아요 수 [Required]
 * @param {boolean} isDisabled - 비활성화 여부 [Optional, 기본값: false]
 * @param {function} onToggle - 클릭 시 실행 [Required]
 *
 * Example usage:
 * <LikeButton isLiked={ liked } count={ 3 } onToggle={ handleToggle } />
 */
function LikeButton({ isLiked, count, isDisabled = false, onToggle }) {
  return (
    <Button
      variant={ isLiked ? 'contained' : 'outlined' }
      onClick={ onToggle }
      disabled={ isDisabled }
      startIcon={ isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
      aria-pressed={ isLiked }
      sx={ isLiked
        ? { bgcolor: '#C8665B', '&:hover': { bgcolor: '#B3564C' } }
        : { color: '#C8665B', borderColor: '#E3B8B2', '&:hover': { borderColor: '#C8665B', bgcolor: 'rgba(200, 102, 91, 0.06)' } } }
    >
      좋아요 { count }
    </Button>
  );
}

export default LikeButton;
