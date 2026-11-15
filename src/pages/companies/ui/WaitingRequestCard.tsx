import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LockClosedIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

interface Props {
  company: any
  request: any
  ownerName?: string
}

export function WaitingRequestCard({
  company,
  request,
  ownerName,
}: Props) {
  const queryClient = useQueryClient()

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/join-requests/${request.uuid}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Не удалось отменить заявку')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-join-requests', company.uuid],
      })
    },
  })

  const requestDate = request.dateText
    || (request.created_at
      ? new Date(request.created_at).toLocaleString('ru-RU')
      : null)

  const ownerInitials = ownerName
    ? ownerName
        .split(' ')
        .map((name: string) => name[0])
        .join('')
    : 'В'

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback variant="brand">
                {company?.name?.[0] || 'К'}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="text-xl font-bold text-[var(--text)]">
                {company?.name || 'Компания'}
              </div>

              <div className="text-xs text-[var(--text-3)]">
                {company?.industry}
                {company?.industry && company?.uuid ? ' · ' : ''}
                {company?.uuid}
              </div>
            </div>
          </div>

          <Badge variant="secondary" className="text-[var(--warn)]">
            <div className="size-1.5 rounded-full bg-[var(--warn)] mr-1.5" />
            Ожидает подтверждения
          </Badge>
        </div>

        <div className="border-t border-[var(--border)] pt-4 space-y-3">
          {requestDate && (
            <div className="text-sm text-[var(--text-2)]">
              Запрос отправлен {requestDate}
            </div>
          )}

          {request.message && (
            <div className="text-sm italic text-[var(--text-3)]">
              «{request.message}»
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-[var(--text-2)]">
            <Avatar>
              <AvatarFallback variant="brand">
                {ownerInitials}
              </AvatarFallback>
            </Avatar>

            Подтверждает {ownerName || 'владелец'} · владелец
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button disabled>
            <LockClosedIcon className="size-4" />
            Доступ ещё не открыт
          </Button>

          <Button
            variant="outline"
            disabled={cancelMutation.isPending}
            onClick={() => cancelMutation.mutate()}
          >
            {cancelMutation.isPending
              ? 'Отмена...'
              : 'Отменить запрос'}
          </Button>
        </div>

        {cancelMutation.isError && (
          <p className="text-sm text-red-500 mt-3">
            Не удалось отменить заявку. Попробуйте ещё раз.
          </p>
        )}
      </CardContent>
    </Card>
  )
}