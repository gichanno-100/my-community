/**
 * 날짜를 'YYYY. MM. DD. HH:mm' 형태로 변환
 * @param {string} value - ISO 날짜 문자열
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));
}
