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
