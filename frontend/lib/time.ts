export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diffMs = Date.now() - then
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Az önce gönderildi'
  if (mins < 60) return `${mins} dakika önce gönderildi`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} saat önce gönderildi`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} gün önce gönderildi`
  return new Date(iso).toLocaleDateString('tr-TR')
}
