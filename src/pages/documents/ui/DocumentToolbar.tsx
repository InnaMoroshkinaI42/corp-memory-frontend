import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

export function DocumentToolbar({ count }: { count: number }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-3)]" />
        <Input placeholder="Поиск по названию документа..." className="pl-9 h-10" />
      </div>
      <Button variant="outline" className="h-10 px-4 gap-2">Все типы <span className="text-[10px]">↓</span></Button>
      <Button variant="outline" className="h-10 px-4 gap-2">Все статусы <span className="text-[10px]">↓</span></Button>
      <Button variant="outline" className="h-10 px-4 gap-2">Дата загрузки <span className="text-[10px]">↓</span></Button>
      <span className="text-sm text-[var(--text-3)]">Количество документов: {count}</span>
    </div>
  )
}