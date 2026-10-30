import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'

// Статичные данные для прав (можно хранить здесь, т.к. это константа)
const INITIAL_PERMISSIONS = [
  { id: 'view', name: 'Просматривать и спрашивать ИИ', owner: true, admin: true, member: true, viewer: true },
  { id: 'edit', name: 'Загружать и редактировать документы', owner: true, admin: true, member: true, viewer: false },
  { id: 'invite', name: 'Приглашать и управлять участниками', owner: true, admin: true, member: false, viewer: false },
  { id: 'manage', name: 'Одобрять запросы, менять настройки', owner: true, admin: false, member: false, viewer: false },
]

export function PermissionsTable() {
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS)

  const toggle = (permId: string, role: 'admin' | 'member' | 'viewer') => {
    setPermissions(prev =>
      prev.map(p => p.id === permId ? { ...p, [role]: !p[role] } : p)
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Роли и доступы</CardTitle>
        <p className="text-sm text-[var(--text-3)] mt-1">Общие правила для всех документов и чатов компании</p>
      </CardHeader>
      <CardContent className="">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-1/2">Возможность</TableHead>
              <TableHead className="text-center">Владелец</TableHead>
              <TableHead className="text-center">Администратор</TableHead>
              <TableHead className="text-center">Участник</TableHead>
              <TableHead className="text-center">Наблюдатель</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-[var(--text)]">{p.name}</TableCell>
                {/* Владелец — всегда true, disabled */}
                <TableCell className="text-center">
                  <input type="checkbox" checked={p.owner} disabled className="size-4 accent-[var(--brand-primary)] cursor-not-allowed" />
                </TableCell>
                {/* Администратор */}
                <TableCell className="text-center">
                  <input 
                    type="checkbox" 
                    checked={p.admin} 
                    onChange={() => toggle(p.id, 'admin')}
                    className="size-4 accent-[var(--brand-primary)] cursor-pointer" 
                  />
                </TableCell>
                {/* Участник */}
                <TableCell className="text-center">
                  <input 
                    type="checkbox" 
                    checked={p.member} 
                    onChange={() => toggle(p.id, 'member')}
                    className="size-4 accent-[var(--brand-primary)] cursor-pointer" 
                  />
                </TableCell>
                {/* Наблюдатель */}
                <TableCell className="text-center">
                  <input 
                    type="checkbox" 
                    checked={p.viewer} 
                    onChange={() => toggle(p.id, 'viewer')}
                    className="size-4 accent-[var(--brand-primary)] cursor-pointer" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="px-6 py-4 text-xs text-[var(--text-3)]">
          Материалы не доступны другим компаниям. ИИ не использует данные компании для обучения.
        </div>
      </CardContent>
    </Card>
  )
}