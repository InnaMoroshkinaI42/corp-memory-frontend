
import { useState } from 'react'
import {
  CopyIcon,
  UpdateIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Badge } from '@/shared/ui/badge'

interface Props {
  companyId: string
}

export function InviteLinkCard({ companyId }: Props) {
  const [inviteCode, setInviteCode] = useState('k7m2')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)

  const inviteLink = `app.meetmind.ru/join/${companyId}-${inviteCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopied(false)
      setCopyError(true)
    }
  }

  const handleRefresh = () => {
    const newCode = crypto.randomUUID()
      .replaceAll('-', '')
      .slice(0, 8)

    setInviteCode(newCode)
    setCopied(false)
    setCopyError(false)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ссылка-приглашение</CardTitle>
        <p className="text-sm text-[var(--text-3)] mt-1">
          Срок действия уточняется
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input
            readOnly
            value={inviteLink}
            className="bg-[var(--surface-2)]"
          />

          <Button
            variant="outline"
            className="gap-2"
            onClick={handleCopy}
          >
            <CopyIcon className="size-4" />
            {copied ? 'Скопировано' : 'Скопировать'}
          </Button>

          <Button
            variant="outline"
            className="gap-2"
            onClick={handleRefresh}
          >
            <UpdateIcon className="size-4" />
            Обновить ссылку
          </Button>
        </div>

        {copyError && (
          <p className="text-sm text-red-500">
            Не удалось скопировать ссылку
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
            <CheckCircledIcon className="size-4 text-[var(--success)]" />
            Вступление по ссылке — только после одобрения владельцем.
          </div>

          <Badge
            variant="secondary"
            className="text-[var(--success)]"
          >
            Обязательно
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
