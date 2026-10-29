import { Card, CardContent } from './card'

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  subtext?: string
}

export function StatCard({ icon: Icon, label, value, subtext }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-medium text-[var(--text-2)]">{label}</span>
          <Icon className="size-5 text-[var(--text-3)]" />
        </div>
        <div className="text-3xl font-bold text-[var(--text)]">{value}</div>
        {subtext && <div className="mt-1 text-xs text-[var(--text-3)]">{subtext}</div>}
      </CardContent>
    </Card>
  )
}