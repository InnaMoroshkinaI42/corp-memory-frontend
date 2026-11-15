
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'

interface DangerZoneProps {
  companyId: string
}

export function DangerZone({ companyId }: DangerZoneProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(
          response.status === 403
            ? 'У вас нет прав на удаление этой компании.'
            : 'Не удалось удалить компанию. Попробуйте ещё раз.'
        )
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.removeQueries({ queryKey: ['company', companyId] })
      navigate('/companies')
    },
  })

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Вы действительно хотите удалить компанию? Все её документы, чаты и решения будут удалены без возможности восстановления.'
    )

    if (confirmed) {
      deleteMutation.mutate()
    }
  }

  return (
    <Card className="border-[var(--danger-soft)] bg-[var(--danger-soft)]/30">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <div className="font-semibold text-[var(--text)]">
            Удаление компании
          </div>
          <div className="text-sm text-[var(--text-2)] mt-1">
            Все документы, чаты и решения будут удалены без возможности восстановления.
          </div>

          {deleteMutation.isError && (
            <div className="text-sm text-red-600 mt-2">
              {deleteMutation.error.message}
            </div>
          )}
        </div>

        <Button
          variant="destructive"
          disabled={deleteMutation.isPending}
          onClick={handleDelete}
        >
          {deleteMutation.isPending ? 'Удаление...' : 'Удалить компанию'}
        </Button>
      </CardContent>
    </Card>
  )
}
