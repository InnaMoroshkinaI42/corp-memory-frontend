// Enums
export type DocumentStatus = 'UPLOAD' | 'PREPARING' | 'ACTIVE' | 'DELETED'
export type ChatMessageAuthor = 'USER' | 'AI'
export type CompanyJoinRequestStatus = 'SENDED' | 'ACCEPT' | 'REJECT'

// Entities
export interface User {
  uuid: string
  first_name: string
  last_name: string
  company_id?: string | null
}

export interface Company {
  uuid: string
  name: string
  owner_id: string
  created_at: string
}

export interface Chat {
  uuid: string
  company_id: string
  user_id: string
  title: string
  created_at: string
}

export interface ChatMessage {
  uuid: string
  chat_id: string
  role: ChatMessageAuthor
  content: string
  created_at: string
}

export interface Document {
  uuid: string
  company_id: string
  user_id: string
  s3_key: string
  s3_bucket: string
  original_name: string
  mime_type: string
  status: DocumentStatus
  created_at: string
  updated_at: string
}

export interface CompanyJoinRequest {
  uuid: string
  company_id: string
  user_id: string
  status: CompanyJoinRequestStatus
  created_at: string
}