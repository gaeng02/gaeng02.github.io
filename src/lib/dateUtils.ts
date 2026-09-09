const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = (value: number) => String(value).padStart(2, '0')

// Publication dates are calendar dates; modification timestamps use the blog's KST timezone.
// Never depend on the build machine or reader's timezone.
function dateParts(value: string): { year: number; month: number; day: number } | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return { year, month, day }
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric', day: 'numeric',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  return { year: get('year'), month: get('month'), day: get('day') }
}

export function formatDate(value: string): string {
  const parts = dateParts(value)
  return parts ? `${parts.day} ${monthNames[parts.month - 1]}, ${parts.year}` : value
}

export function getMonthName(month: number): string {
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return names[month - 1]
}

export function formatDot(value: string): string {
  const parts = dateParts(value)
  return parts ? `${parts.year}.${pad(parts.month)}.${pad(parts.day)}` : value
}

export function formatDotShort(value: string): string {
  const parts = dateParts(value)
  return parts ? `${String(parts.year).slice(2)}.${pad(parts.month)}.${pad(parts.day)}` : value
}
