import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

/**
 * PasswordField 컴포넌트
 * 눈 아이콘으로 비밀번호 보기/숨기기를 전환하는 입력칸.
 * 그 외 props 는 MUI TextField 에 그대로 전달된다.
 *
 * Props:
 * @param {string} label - 입력칸 라벨 [Required]
 * @param {string} value - 입력값 [Required]
 * @param {function} onChange - 입력 변경 시 실행 [Required]
 * @param {object} slotProps - TextField slotProps (htmlInput 등) [Optional, 기본값: {}]
 *
 * Example usage:
 * <PasswordField label="비밀번호" value={ password } onChange={ handleChange } required />
 */
function PasswordField({ label, value, onChange, slotProps = {}, ...rest }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      { ...rest }
      label={ label }
      value={ value }
      onChange={ onChange }
      type={ isVisible ? 'text' : 'password' }
      slotProps={ {
        ...slotProps,
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label={ isVisible ? `${label} 숨기기` : `${label} 보기` }
                aria-pressed={ isVisible }
                onClick={ () => setIsVisible((prev) => !prev) }
                onMouseDown={ (event) => event.preventDefault() }
                sx={ { color: isVisible ? 'primary.main' : 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'rgba(79, 114, 95, 0.08)' } } }
              >
                { isVisible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon /> }
              </IconButton>
            </InputAdornment>
          ),
        },
      } }
    />
  );
}

export default PasswordField;
