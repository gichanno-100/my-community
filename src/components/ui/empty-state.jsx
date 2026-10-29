import Box from '@mui/material/Box';

/**
 * EmptyState 컴포넌트
 * 데이터가 없을 때 안내 문구를 보여준다.
 *
 * Props:
 * @param {string} message - 안내 문구 [Required]
 * @param {node} children - 문구 아래에 표시할 버튼 등 [Optional]
 *
 * Example usage:
 * <EmptyState message="아직 글이 없어요." />
 */
function EmptyState({ message, children }) {
  return (
    <Box
      sx={ { py: 6, px: 2, textAlign: 'center', color: 'text.secondary', bgcolor: 'background.paper', borderRadius: 4, border: 1, borderColor: 'divider', borderStyle: 'dashed' } }
    >
      <Box sx={ { mb: children ? 2 : 0 } }>{ message }</Box>
      { children }
    </Box>
  );
}

export default EmptyState;
