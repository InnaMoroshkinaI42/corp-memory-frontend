import { cn } from '@/shared/lib'

interface Props {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TABS = ['Основные', 'Доступы и безопасность', 'Тариф и оплата']

export function SettingsTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex gap-6 border-b border-[var(--border)] mb-8">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "pb-3 text-sm font-medium transition-colors",
            activeTab === tab
              ? "text-[var(--brand-primary)] border-b-2 border-[var(--brand-primary)]"
              : "text-[var(--text-2)] hover:text-[var(--text)]"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}