import { Card, CardContent } from './card'
import { Badge } from './badge'

interface Props {
  tasks: any[]
}

export function ChatTaskCard({ tasks }: Props) {
  return (
    <Card className="bg-[var(--surface-2)] border-none shadow-none">
      <CardContent className="p-4 space-y-3">
        <div className="font-semibold text-sm mb-2">Ответственные и сроки</div>
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start justify-between text-sm">
            <div>
              <div className="font-medium text-[var(--text)]">{task.assignee}</div>
              <div className="text-xs text-[var(--text-3)]">{task.title}</div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--text)]">
              {task.due}
              <Badge variant="secondary" className="px-1.5 rounded text-[10px]">
                {task.sourceIndex}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}