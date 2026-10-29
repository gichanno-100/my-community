import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';

import { formatDate } from '../../utils/format-date.js';

/**
 * ProfileCard 컴포넌트
 * 내 프로필(닉네임, 이메일, 가입일)과 닉네임 수정.
 *
 * Props:
 * @param {object} profile - { nickname, created_at } [Required]
 * @param {string} email - 로그인 이메일 [Optional, 기본값: '']
 * @param {function} onSaveNickname - 닉네임 저장 시 실행 (nickname) => Promise [Required]
 *
 * Example usage:
 * <ProfileCard profile={ profile } email={ user.email } onSaveNickname={ handleSave } />
 */
function ProfileCard({ profile, email = '', onSaveNickname }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    try {
      await onSaveNickname(nickname.trim());
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardContent sx={ { p: { xs: 2.5, md: 3 }, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' } }>
        <Avatar sx={ { width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.4rem' } }>
          { profile.nickname.slice(0, 1) }
        </Avatar>
        <Box sx={ { flex: 1, minWidth: 200 } }>
          { isEditing ? (
            <Box sx={ { display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap' } }>
              <TextField
                size="small"
                label="닉네임"
                value={ nickname }
                onChange={ (event) => setNickname(event.target.value) }
                slotProps={ { htmlInput: { maxLength: 30 } } }
              />
              <Button variant="contained" onClick={ handleSave } disabled={ isSaving || !nickname.trim() }>저장</Button>
              <Button color="inherit" onClick={ () => { setIsEditing(false); setNickname(profile.nickname); } }>취소</Button>
            </Box>
          ) : (
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
              <Box sx={ { fontWeight: 700, fontSize: '1.25rem' } }>{ profile.nickname }</Box>
              <Button size="small" onClick={ () => setIsEditing(true) }>닉네임 수정</Button>
            </Box>
          ) }
          <Box sx={ { color: 'text.secondary', fontSize: '0.85rem', mt: 0.5 } }>
            { email } · 가입일 { formatDate(profile.created_at) }
          </Box>
          { errorMessage && <Alert severity="error" sx={ { mt: 1, borderRadius: 3 } }>{ errorMessage }</Alert> }
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
