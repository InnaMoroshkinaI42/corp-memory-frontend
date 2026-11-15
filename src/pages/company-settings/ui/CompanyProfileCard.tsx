
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CopyIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Badge } from '@/shared/ui/badge'

interface Props {
  company: any
}

export function CompanyProfileCard({ company }: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string
      description: string
      domain: string
    }) => {
      const response = await fetch(`/api/companies/${company.uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Не удалось сохранить изменения компании')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company', company.uuid],
      })
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      })
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const name = (formData.get('name') as string).trim()
    const description = (formData.get('description') as string).trim()
    const domain = (formData.get('domain') as string).trim()

    if (!name) return

    mutation.mutate({
      name,
      description,
      domain,
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* О компании */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>О компании</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Название компании</Label>
              <Input
                id="name"
                name="name"
                defaultValue={company.name}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc">Описание</Label>
              <Input
                id="desc"
                name="description"
                defaultValue={company.description ?? ''}
                maxLength={500}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="domain">Рабочий домен</Label>
              <Input
                id="domain"
                name="domain"
                defaultValue={company.domain ?? ''}
                maxLength={253}
              />
            </div>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>

            {mutation.isError && (
              <p className="text-sm text-red-500">
                {mutation.error.message}
              </p>
            )}

            {mutation.isSuccess && (
              <p className="text-sm text-green-600">
                Изменения успешно сохранены
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* ID компании */}
      <Card>
        <CardHeader>
          <CardTitle>ID компании</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--text-2)]">
            Передайте ID коллеге, чтобы он отправил запрос на вступление.
          </p>

          <div className="flex items-center justify-between rounded-lg bg-[var(--surface-2)] p-4">
            <span className="text-2xl font-bold font-mono tracking-wider text-[var(--brand-primary)]">
              {company.uuid.toUpperCase()}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigator.clipboard.writeText(company.uuid)}
              title="Скопировать ID"
            >
              <CopyIcon className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[var(--brand-light)] text-[var(--brand-primary)]">
              Владелец: {company.owner_name || 'Алексей Морозов'}
            </Badge>
          </div>

          <p className="text-xs text-[var(--text-3)] mt-2">
            ID постоянный. Знание ID не даёт доступ: каждый запрос подтверждает владелец.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
