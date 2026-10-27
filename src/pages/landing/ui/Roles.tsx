import { Card, CardContent } from '@/shared/ui/card'

const ROLES = [
  { title: 'Владелец', desc: 'Полный доступ, подтверждение заявок, биллинг и удаление компании.' },
  { title: 'Администратор', desc: 'Управление участниками, документами и публичными ссылками.' },
  { title: 'Участник', desc: 'Загрузка материалов, чат с ИИ, работа с задачами.' },
  { title: 'Наблюдатель', desc: 'Просмотр конспектов и решений без права загрузки.' }
]

export function Roles() {
  return (
    <section className="py-20 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--text)]">Роли под структуру компании</h2>
        <p className="mt-4 text-center text-[var(--text-2)]">Владелец управляет доступом, команда — работает со знаниями.</p>
        
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-4">
          {ROLES.map((role, i) => (
            <Card key={i} className="bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[var(--text)]">{role.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-2)] leading-relaxed">{role.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}