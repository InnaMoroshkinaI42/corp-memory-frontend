import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeftIcon, PersonIcon, PlusIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function CreateCompanyPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/profile').then((r) => r.json()),
  })

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error('Failed to create company')
      return res.json()
    },
    onSuccess: (newCompany) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      navigate(`/app/overview/${newCompany.uuid}`)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    if (!name.trim()) return
    mutation.mutate(name)
  }

  if (!user) return <div className="p-8">Загрузка...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Заголовок и кнопка */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Создать компанию</h1>
          <p className="mt-2 text-[var(--text-2)]">
            Начните с команды. Документы и чаты появятся в её отдельном пространстве.
          </p>
        </div>
        <Link to="/companies">
          <Button variant="outline">
            <ArrowLeftIcon className="size-4" /> К моим компаниям
          </Button>
        </Link>
      </div>

      <div className="flex gap-12">
        
        {/* Левая колонка — Форма */}
        <Card className="flex-1">
          <CardContent className="p-8">
            <div className="mb-6 grid size-16 place-items-center rounded-2xl bg-[var(--brand-light)] text-3xl font-bold text-[var(--brand-primary)]">
              C
            </div>
            
            <CardTitle className="mb-6 text-xl">Расскажите о компании</CardTitle>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Название компании *</Label>
                <Input id="name" name="name" placeholder="Например, Север" required />
                <p className="text-xs text-[var(--text-3)]">Это название увидят все участники компании.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Описание</Label>
                <Input id="description" name="description" placeholder="Продуктовая команда Atlas" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="domain">Рабочий домен</Label>
                <Input id="domain" name="domain" placeholder="sever.team" />
                <p className="text-xs text-[var(--text-3)]">Не даёт автоматического доступа. Вступление подтверждает владелец.</p>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-[var(--surface-2)] p-4">
                <PersonIcon className="mt-0.5 size-5 text-[var(--brand-primary)]" />
                <div>
                  <div className="font-semibold text-[var(--text)]">Вы станете владельцем компании</div>
                  <div className="mt-1 text-sm text-[var(--text-2)]">
                    {user.first_name} {user.last_name} · {user.email}. Вы сможете управлять доступами и одобрять запросы.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                >
                  <PlusIcon className="size-4" /> {mutation.isPending ? 'Создание...' : 'Создать компанию'}
                </Button>
                <Link to="/companies">
                  <Button type="button" variant="outline">Отмена</Button>
                </Link>
              </div>
              <p className="text-xs text-[var(--text-3)] mt-4">
                ID и ссылка-приглашение будут созданы автоматически.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Правая колонка — Инструкция */}
        <div className="w-80 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text-2)]">
            <div className="size-1.5 rounded-full bg-[var(--brand-primary)]" /> Первый шаг
          </span>

          <h2 className="text-2xl font-bold text-[var(--text)]">От компании к общей памяти</h2>

          <div className="space-y-6">
            {[
              { n: 1, title: 'Создайте компанию', desc: 'Название и описание — всего одна минута.' },
              { n: 2, title: 'Пригласите коллег', desc: 'Отправьте ID или ссылку. Одобрите запросы на вступление.' },
              { n: 3, title: 'Добавьте первую встречу', desc: 'ИИ выделит решения и ключевые мысли.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--surface-2)] text-xs font-bold text-[var(--text-2)]">
                  {step.n}
                </div>
                <div>
                  <div className="font-semibold text-[var(--text)]">{step.title}</div>
                  <div className="mt-1 text-sm text-[var(--text-3)] leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-[var(--text-3)] leading-relaxed">
            Документы и чаты всегда принадлежат одной компании и не смешиваются с другими пространствами.
          </p>
        </div>

      </div>
    </div>
  )
}