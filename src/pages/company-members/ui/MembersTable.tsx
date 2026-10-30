import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'

export function MembersTable({ members }: { members: any[] }) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs uppercase text-[var(--text-3)]">Участник</TableHead>
            <TableHead className="text-xs uppercase text-[var(--text-3)]">Роль</TableHead>
            <TableHead className="text-xs uppercase text-[var(--text-3)]">Дата вступления</TableHead>
            <TableHead className="text-xs uppercase text-[var(--text-3)]">Статус</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.uuid}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 bg-[var(--brand-light)]">
                    <AvatarFallback className="text-[var(--brand-primary)] text-xs font-bold">
                      {member.first_name[0]}{member.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-[var(--text)]">{member.first_name} {member.last_name}</div>
                    <div className="text-xs text-[var(--text-3)]">{member.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-[var(--text-2)] cursor-pointer hover:text-[var(--text)]">
                  {member.role} <span className="text-[10px]">↓</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-[var(--text-2)]">1 окт 2026</TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-[var(--success)]">
                  <div className="size-1.5 rounded-full bg-[var(--success)] mr-1.5" /> Активен
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" >
                  <DotsHorizontalIcon className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}