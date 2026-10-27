import { LayersIcon, RocketIcon, CodeIcon, PersonIcon } from '@radix-ui/react-icons'

const TEAMS = [
  { icon: LayersIcon, label: 'Продуктовые команды' },
  { icon: RocketIcon, label: 'Консалтинг' },
  { icon: CodeIcon, label: 'Разработка' },
  { icon: PersonIcon, label: 'HR и операции' }
]

export function ForTeams() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-3)]">
          Для команд, которым важно помнить
        </p>
        
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          {TEAMS.map((team, i) => (
            <div key={i} className="flex items-center justify-center gap-3 text-[var(--text-2)]">
              <team.icon className="size-6" />
              <span className="text-sm font-medium">{team.label}</span>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}