import { ArrowLeftIcon, DownloadIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'

interface Props {
  companyId: string
  title: string
  subtitle: string
}

export function DocumentHeader({ companyId, title, subtitle }: Props) {
  return (
    <div className="mb-6">
      <Link to={`/app/documents/${companyId}`} className="inline-flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[var(--text)] mb-4">
        <ArrowLeftIcon className="size-4" /> К документам
      </Link>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">{title}</h1>
          <p className="mt-2 text-[var(--text-2)]">{subtitle}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2"><DownloadIcon className="size-4" /> Скачать</Button>
          <Link to={`/app/chats/${companyId}`}>
            <Button className="gap-2"><ChatBubbleIcon className="size-4" /> Спросить ИИ</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}