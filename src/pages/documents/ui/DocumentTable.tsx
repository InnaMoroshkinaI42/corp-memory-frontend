import { FileTextIcon, DownloadIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'

interface Props {
  documents: any[]
}

export function DocumentTable({ documents }: Props) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Документ</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.uuid}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--text-2)]">
                    <FileTextIcon className="size-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text)]">{doc.original_name}</div>
                    <div className="text-xs text-[var(--text-3)]">{doc.uuid}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-[var(--text-2)]">
                {doc.mime_type?.split('/')[1]?.toUpperCase() || '—'}
              </TableCell>
              <TableCell className="text-sm text-[var(--text-2)]">
                {new Date(doc.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </TableCell>
              <TableCell>
                {doc.status === 'ACTIVE' && (
                  <Badge variant="secondary" className="bg-[var(--success-soft)] text-[var(--success)]">
                    <div className="size-1.5 rounded-full bg-[var(--success)] mr-1.5" /> Готово
                  </Badge>
                )}
                {doc.status === 'PREPARING' && (
                  <Badge variant="secondary" className="bg-[var(--warn-soft)] text-[var(--warn)]">
                    <div className="size-1.5 rounded-full bg-[var(--warn)] mr-1.5" /> Обработка
                  </Badge>
                )}
                {doc.status === 'UPLOAD' && (
                  <Badge variant="secondary" className="bg-[var(--surface-2)] text-[var(--text-2)]">
                    Загрузка...
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <DownloadIcon className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <DotsHorizontalIcon className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {documents.length === 0 && (
        <div className="p-8 text-center text-[var(--text-3)]">Документов пока нет</div>
      )}
    </Card>
  )
}