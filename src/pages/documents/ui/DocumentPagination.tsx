import { Button } from '@/shared/ui/button'

interface Props {
  total: number
  currentPage: number
  pageSize: number
}

export function DocumentPagination({ total, currentPage, pageSize }: Props) {
  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <span className="text-sm text-[var(--text-3)]">
        Показано {Math.min((currentPage - 1) * pageSize + 1, total)}–{Math.min(currentPage * pageSize, total)} из {total} документов
      </span>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" disabled>Назад</Button>
        <Button variant="default" size="sm" className="bg-[var(--brand-primary)]">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <Button variant="outline" size="sm">Далее</Button>
      </div>
    </div>
  )
}