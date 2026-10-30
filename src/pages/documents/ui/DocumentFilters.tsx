import { useState } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Input } from '@/shared/ui/input'

const FILTERS = ['Все', 'Аудио', 'Видео', 'PDF', 'Word', 'Markdown', 'Текст']

export function DocumentFilters() {
  const [activeFilter, setActiveFilter] = useState('Все')

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === filter
                ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                : 'bg-white text-[var(--text-2)] border-[var(--border)] hover:bg-[var(--surface-2)]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="relative w-72">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-3)]" />
        <Input placeholder="Поиск по документам" className="pl-9 h-9" />
      </div>
    </div>
  )
}