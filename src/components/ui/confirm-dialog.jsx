import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * ConfirmDialog 컴포넌트
 * 삭제처럼 되돌릴 수 없는 작업 전에 확인을 받는다.
 *
 * Props:
 * @param {boolean} isOpen - 열림 여부 [Required]
 * @param {string} title - 제목 [Required]
 * @param {string} message - 본문 [Optional, 기본값: '']
 * @param {string} confirmLabel - 확인 버튼 텍스트 [Optional, 기본값: '삭제']
 * @param {function} onConfirm - 확인 클릭 시 실행 [Required]
 * @param {function} onClose - 닫기/취소 시 실행 [Required]
 *
 * Example usage:
 * <ConfirmDialog isOpen={ open } title="삭제할까요?" onConfirm={ handleDelete } onClose={ handleClose } />
 */
function ConfirmDialog({ isOpen, title, message = '', confirmLabel = '삭제', onConfirm, onClose }) {
  return (
    <Dialog open={ isOpen } onClose={ onClose } fullWidth maxWidth="xs">
      <DialogTitle>{ title }</DialogTitle>
      { message && (
        <DialogContent>
          <DialogContentText>{ message }</DialogContentText>
        </DialogContent>
      ) }
      <DialogActions sx={ { px: 3, pb: 2 } }>
        <Button color="inherit" onClick={ onClose }>취소</Button>
        <Button variant="contained" color="error" onClick={ onConfirm }>{ confirmLabel }</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
