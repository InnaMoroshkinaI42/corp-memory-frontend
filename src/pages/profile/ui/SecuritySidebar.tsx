
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircledIcon,
  DesktopIcon,
  ExitIcon,
} from '@radix-ui/react-icons'

import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'

interface SecurityData {
  passwordUpdatedAt: string
  sessions: {
    id: string
    device: string
    location: string
    lastActive: string
    isCurrent: boolean
  }[]
  companyToTransfer: string | null
}

export function SecuritySidebar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')

  const { data: security, isLoading } = useQuery<SecurityData>({
    queryKey: ['profile-security'],
    queryFn: async () => {
      const response = await fetch('/api/profile/security')

      if (!response.ok) {
        throw new Error('Не удалось загрузить настройки безопасности')
      }

      return response.json()
    },
  })

  // Изменение пароля
  const handleChangePassword = async () => {
    const password = window.prompt(
      'Введите новый пароль (не менее 8 символов):',
    )

    if (password === null) return

    if (password.trim().length < 8) {
      setMessage('Пароль должен содержать не менее 8 символов')
      return
    }

    try {
      const response = await fetch('/api/profile/security/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Не удалось изменить пароль')
      }

      await queryClient.invalidateQueries({
        queryKey: ['profile-security'],
      })

      setMessage('Пароль успешно изменён')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Произошла ошибка',
      )
    }
  }

  // Завершение остальных сессий
  const handleTerminateSessions = async () => {
    if (!window.confirm('Завершить все остальные активные сессии?')) {
      return
    }

    try {
      const response = await fetch(
        '/api/profile/security/sessions/terminate-others',
        {
          method: 'POST',
        },
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Не удалось завершить сессии')
      }

      queryClient.setQueryData(
        ['profile-security'],
        (previous: SecurityData | undefined) => {
          if (!previous) return previous

          return {
            ...previous,
            sessions: previous.sessions.filter(
              session => session.isCurrent,
            ),
          }
        },
      )

      setMessage('Остальные сессии завершены')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Произошла ошибка',
      )
    }
  }

  // Удаление аккаунта
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'Вы действительно хотите удалить аккаунт? Это действие необратимо.',
      )
    ) {
      return
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Не удалось удалить аккаунт')
      }

      localStorage.removeItem('token')
      queryClient.clear()
      navigate('/login')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Произошла ошибка',
      )
    }
  }

  if (isLoading || !security) {
    return (
      <div className="p-4 text-sm text-[var(--text-3)]">
        Загрузка...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Безопасность</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="flex items-center gap-2">
            <CheckCircledIcon className="size-5 text-[var(--success)]" />

            <Badge
              variant="secondary"
              className="bg-[var(--success-soft)] text-[var(--success)] rounded-full"
            >
              Email подтверждён
            </Badge>
          </div>

          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            Пароль обновлён {security.passwordUpdatedAt}. Рекомендуем менять
            его регулярно.
          </p>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleChangePassword}
          >
            Изменить пароль
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Активные сессии</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          {security.sessions.map(session => (
            <div key={session.id} className="flex gap-3">
              <DesktopIcon className="mt-0.5 size-5 text-[var(--text-2)]" />

              <div>
                <div className="text-sm font-semibold text-[var(--text)]">
                  {session.device}
                </div>

                <div className="text-xs text-[var(--text-3)]">
                  {session.location} · {session.lastActive}
                </div>

                {session.isCurrent && (
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-[var(--brand-light)] text-[var(--brand-primary)] uppercase tracking-wider text-[10px]"
                  >
                    Текущая сессия
                  </Badge>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleTerminateSessions}
            className="text-left text-sm font-medium text-[var(--brand-primary)] hover:underline"
          >
            Завершить остальные сессии
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Управление аккаунтом</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            Чтобы удалить аккаунт, сначала передайте владение компанией «
            {security.companyToTransfer}».
          </p>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="text-left text-sm font-medium text-[var(--danger)] hover:underline"
          >
            Удаление аккаунта
          </button>
        </CardContent>
      </Card>

      {message && (
        <p role="status" className="text-sm text-[var(--text-2)]">
          {message}
        </p>
      )}

      <div className="flex justify-end gap-3 mt-8">
        <Button
          variant="ghost"
          className="gap-2 text-[var(--danger)] hover:bg-[var(--danger-soft)]"
          onClick={() => {
            localStorage.removeItem('token')
            queryClient.clear()
            navigate('/login')
          }}
        >
          <ExitIcon className="size-4" />
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  )
}
