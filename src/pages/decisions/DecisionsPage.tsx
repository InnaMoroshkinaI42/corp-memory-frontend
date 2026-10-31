import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { RocketIcon, FileTextIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/shared/ui/card'
import { EmptyState } from '@/shared/ui/EmptyState'

export function DecisionsPage() {
  const { id } = useParams()

  const { data: decisions, isLoading } = useQuery({
    queryKey: ['decisions', id],
    queryFn: () => fetch(`/api/companies/${id}/decisions`).then(r => r.json()),
    enabled: !!id,
  })

  if (isLoading) return <div className="p-8">Загрузка...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)]">Реестр решений</h1>
        <p className="mt-2 text-[var(--text-2)]">Все зафиксированные решения компании с источниками.</p>
      </div>

      {decisions?.length > 0 ? (
        <div className="space-y-3">
          {decisions.map((decision: any) => (
            <Card key={decision.uuid} className="p-4 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0 flex items-start gap-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--brand-light)] text-[var(--brand-primary)]">
                  <RocketIcon className="size-5" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--text)]">{decision.text}</div>
                  <a
                    href={`/app/documents/${id}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--brand-primary)] hover:underline"
                  >
                    <FileTextIcon className="size-3.5" /> {decision.source_doc_name}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={RocketIcon}
          title="Решений пока нет"
          description="Решения появятся здесь после обработки материалов встреч."
        />
      )}
    </div>
  )
}