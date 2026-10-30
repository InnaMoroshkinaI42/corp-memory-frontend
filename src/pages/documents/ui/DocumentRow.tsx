import { FileTextIcon, PlayIcon, DotsHorizontalIcon, UpdateIcon } from '@radix-ui/react-icons'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { TableCell, TableRow } from '@/shared/ui/table'

interface Props {
  doc: any
  isSelected: boolean
  onToggle: () => void
}

export function DocumentRow({ doc, isSelected, onToggle }: Props) {
  // Иконка по типу
  const getIcon = () => {
    if (doc.mime_type?.includes('audio')) {
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>
    }
    if (doc.mime_type?.includes('video')) {
      return <PlayIcon className="size-4" />
    }
    return <FileTextIcon className="size-4" />
  }

  return (
    <TableRow className={isSelected ? 'bg-[var(--brand-light)]/50' : ''}>
      {/* Чекбокс */}
      <TableCell className="w-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="size-4 rounded border-[var(--border-strong)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
        />
      </TableCell>

      {/* Название + иконка */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--text-2)]">
            {getIcon()}
          </div>
          <div>
            {/* Имя файла: если нет original_name, берём mime_type */}
            <div className="font-semibold text-[var(--text)]">
              {doc.original_name || doc.mime_type?.split('/')[1]?.toUpperCase() || 'Без названия'}
            </div>
            <div className="text-xs text-[var(--text-3)]">{doc.uuid}</div>
          </div>
        </div>
      </TableCell>

      {/* Тип */}
      <TableCell className="text-sm text-[var(--text-2)]">
        {doc.mime_type?.split('/')[1]?.toUpperCase() || '—'}
      </TableCell>

      {/* Статус */}
      <TableCell>
        {doc.status === 'ACTIVE' && (
          <Badge variant="secondary" className="bg-[var(--success-soft)] text-[var(--success)]">
            <div className="size-1.5 rounded-full bg-[var(--success)] mr-1.5" /> Готов
          </Badge>
        )}
        {doc.status === 'PREPARING' && (
          <Badge variant="secondary" className="bg-[var(--warn-soft)] text-[var(--warn)]">
            <div className="size-1.5 rounded-full bg-[var(--warn)] mr-1.5" /> Обрабатывается
          </Badge>
        )}
        {doc.status === 'ERROR' && (
          <Badge variant="secondary" className="bg-[var(--danger-soft)] text-[var(--danger)]">
            <div className="size-1.5 rounded-full bg-[var(--danger)] mr-1.5" /> Ошибка
          </Badge>
        )}
      </TableCell>

      {/* Дата */}
      <TableCell className="text-sm text-[var(--text-2)]">
        {new Date(doc.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
      </TableCell>

      {/* Загрузил (пока хардкод, потом можно добавить в мок) */}
      <TableCell className="text-sm text-[var(--text-2)]">Мария Крылова</TableCell>

      {/* Три точки */}
      <TableCell className="text-right">
        <Button variant="ghost" size="icon">
          {doc.status === 'ERROR' ? <UpdateIcon className="size-4" /> : <DotsHorizontalIcon className="size-4" />}
        </Button>
      </TableCell>
    </TableRow>
  )
}