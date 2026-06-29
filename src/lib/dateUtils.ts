// 클라이언트와 서버 모두에서 사용 가능한 날짜 유틸리티 함수

// 날짜를 포맷팅 (예: "7 Feb, 2026")
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month}, ${year}`
}

// 월 이름 가져오기 (영문)
export function getMonthName(month: number): string {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return monthNames[month - 1]
}

const pad = (n: number) => String(n).padStart(2, '0')

// 날짜를 점 포맷으로 (예: "2026.01.15")
export function formatDot(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
}

// 짧은 점 포맷 (예: "26.01.15")
export function formatDotShort(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return `${String(date.getFullYear()).slice(2)}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
}
