import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

const TYPES = ['Все', 'video', 'audio', 'pdf']
const STATUSES = ['Все', 'ACTIVE', 'PREPARING']

interface Props {
  count: number
  typeFilter: string
  setTypeFilter: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
}

export function DocumentToolbar({ count, typeFilter, setTypeFilter, statusFilter, setStatusFilter }: Props) {
  const nextType = () => {
    const i = TYPES.indexOf(typeFilter)
    setTypeFilter(TYPES[(i + 1) % TYPES.length])
  }
  const nextStatus = () => {
    const i = STATUSES.indexOf(statusFilter)
    setStatusFilter(STATUSES[(i + 1) % STATUSES.length])
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-3)]" />
        <Input placeholder="Поиск по названию документа..." className="pl-9 h-10" />
      </div>
      <Button variant="outline" className="h-10 px-4 gap-2" onClick={nextType}>
        {typeFilter === 'Все' ? 'Все типы' : typeFilter} <span className="text-[10px]">↓</span>
      </Button>
      <Button variant="outline" className="h-10 px-4 gap-2" onClick={nextStatus}>
        {statusFilter === 'Все' ? 'Все статусы' : statusFilter} <span className="text-[10px]">↓</span>
      </Button>
      <Button variant="outline" className="h-10 px-4 gap-2">Дата загрузки <span className="text-[10px]">↓</span></Button>
      <span className="text-sm text-[var(--text-3)]">Количество документов: {count}</span>
    </div>
  )
}