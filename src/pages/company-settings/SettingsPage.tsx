import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SettingsTabs } from './ui/SettingsTabs'
import { CompanyProfileCard } from './ui/CompanyProfileCard'
import { InviteLinkCard } from './ui/InviteLinkCard'
import { PermissionsTable } from './ui/PermissionsTable'
import { DangerZone } from './ui/DangerZone'
import { SecurityTab } from './ui/SecurityTab'
import { BillingTab } from './ui/BillingTab'

interface Company {
  uuid: string
  name: string
  industry?: string
  owner_name?: string
}

export function SettingsPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('Основные')

  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ['company', id],
    queryFn: () => fetch(`/api/companies/${id}`).then(r => r.json()),
    enabled: !!id,
  })

  if (isLoading || !company) return <div className="p-8">Загрузка...</div>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text)]">Настройки компании</h1>
        <p className="mt-2 text-[var(--text-2)]">
          Идентификатор, приглашения и правила доступа компании «{company.name}».
        </p>
      </div>

      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'Основные' && (
        <>
          <CompanyProfileCard company={company} />
          <InviteLinkCard companyId={company.uuid} />
          <PermissionsTable />
          <DangerZone />
        </>
      )}

      {activeTab === 'Доступы и безопасность' && <SecurityTab />}
      {activeTab === 'Тариф и оплата' && <BillingTab />}
    </div>
  )
}