import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * LoadingState 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <LoadingState />
 */
function LoadingState() {
  return (
    <Box sx={ { display: 'flex', justifyContent: 'center', py: 6 } }>
      <CircularProgress />
    </Box>
  );
}

export default LoadingState;
