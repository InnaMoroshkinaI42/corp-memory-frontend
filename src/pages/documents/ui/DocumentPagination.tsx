import { Button } from '@/shared/ui/button'

interface Props {
  total: number
  currentPage: number
  pageSize: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function DocumentPagination({ total, currentPage, pageSize, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <span className="text-sm text-[var(--text-3)]">
        Показано {Math.min((currentPage - 1) * pageSize + 1, total)}–{Math.min(currentPage * pageSize, total)} из {total} документов
      </span>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          Назад
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
          Далее
        </Button>
      </div>
    </div>
  )
}