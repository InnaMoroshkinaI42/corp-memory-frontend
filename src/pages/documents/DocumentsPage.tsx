import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PlusIcon, DownloadIcon, TrashIcon } from '@radix-ui/react-icons'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { DocumentToolbar } from './ui/DocumentToolbar'
import { DocumentRow } from './ui/DocumentRow'
import { DocumentPagination } from './ui/DocumentPagination'

export function DocumentsPage() {
  const { id } = useParams()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Запрос на документы
  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ['documents', id],
    queryFn: () => fetch(`/api/companies/${id}/documents`).then(r => r.json()),
    enabled: !!id,
  })

  // Запрос на компанию (для названия)
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: () => fetch(`/api/companies/${id}`).then(r => r.json()),
    enabled: !!id,
  })

  if (docsLoading || companyLoading) return <div className="p-8">Загрузка...</div>

  const count = documents?.length || 0

  const toggleSelect = (uuid: string) => {
    setSelectedIds(prev =>
      prev.includes(uuid) ? prev.filter(item => item !== uuid) : [...prev, uuid]
    )
  }

  const toggleAll = () => {
    if (selectedIds.length === count && count > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(documents?.map((d: any) => d.uuid) || [])
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* Заголовок */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Документы</h1>
          <p className="mt-2 text-[var(--text-2)]">
            {count} материала в памяти компании «{company?.name || '...'}».
          </p>
        </div>
        <Link to={`/app/documents/upload/${id}`}>
          <Button >
            <PlusIcon className="size-4" /> Загрузить документ
          </Button>
        </Link>
      </div>

      {/* Панель действий, если что-то выбрано */}
      {selectedIds.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-[var(--brand-primary)]/20 bg-[var(--brand-light)] p-3">
          <span className="text-sm font-medium text-[var(--brand-primary)]">
            Выбрано: {selectedIds.length}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" >
              <DownloadIcon className="size-4" /> Скачать
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-[var(--danger)]/20 bg-white text-[var(--danger)] hover:bg-[var(--danger-soft)]">
              <TrashIcon className="size-4" /> Удалить
            </Button>
          </div>
        </div>
      )}

      {/* Тулбар (поиск, фильтры) */}
      <DocumentToolbar count={count} />

      {/* Таблица */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[var(--surface-2)] hover:bg-transparent">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  className="size-4 rounded border-[var(--border-strong)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                  checked={selectedIds.length === count && count > 0}
                  onChange={toggleAll}
                />
              </TableHead>
              <TableHead className="text-xs uppercase text-[var(--text-3)]">Название</TableHead>
              <TableHead className="text-xs uppercase text-[var(--text-3)]">Тип</TableHead>
              <TableHead className="text-xs uppercase text-[var(--text-3)]">Статус</TableHead>
              <TableHead className="text-xs uppercase text-[var(--text-3)]">Дата ↓</TableHead>
              <TableHead className="text-xs uppercase text-[var(--text-3)]">Загрузил</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.map((doc: any) => (
              <DocumentRow 
                key={doc.uuid} 
                doc={doc}
                isSelected={selectedIds.includes(doc.uuid)}
                onToggle={() => toggleSelect(doc.uuid)}
              />
            ))}
          </TableBody>
        </Table>
        {count === 0 && (
          <div className="p-8 text-center text-[var(--text-3)]">Документов пока нет</div>
        )}
      </Card>

      {/* Пагинация */}
      <DocumentPagination total={count} currentPage={1} pageSize={9} />

      {/* Подпись */}
      <div className="mt-8 flex items-center gap-2 text-xs text-[var(--text-3)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>
        ИИ отвечает только по готовым материалам. Загрузка → транскрибация → AI-анализ. При ошибке документ можно загрузить повторно.
      </div>
    </div>
  )
}