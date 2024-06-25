export default function formatDate(timestamp: any) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ko-KR');
}
