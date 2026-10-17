export const ROUTES = {
  ROOT: '/',
  LANDING: '/',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',

  PROFILE: '/profile',

  COMPANIES: '/companies',
  COMPANY_CREATE: '/companies/create',
  COMPANY_JOIN: '/companies/join',
  COMPANY_JOIN_WAITING: '/companies/join/waiting',
  COMPANY_OVERVIEW: '/companies/:id',
  COMPANY_REQUESTS: '/companies/:id/requests',
  COMPANY_MEMBERS: '/companies/:id/members',
  COMPANY_SETTINGS: '/companies/:id/settings',
  COMPANY_DOCUMENTS: '/companies/:id/documents',

  DOCUMENTS_UPLOAD: '/documents/upload',
  DOCUMENT_VIDEO: '/documents/:id/video',

  CHATS: '/chats',
  CHAT_NEW: '/chats/new',
  CHAT_DETAIL: '/chats/:id',

  NOT_FOUND: '*',
  FORBIDDEN: '/403',
} as const

export const buildPath = {
  companyOverview: (id: string) => `/companies/${id}`,
  companyRequests: (id: string) => `/companies/${id}/requests`,
  companyMembers: (id: string) => `/companies/${id}/members`,
  companySettings: (id: string) => `/companies/${id}/settings`,
  companyDocuments: (id: string) => `/companies/${id}/documents`,
  chatDetail: (id: string) => `/chats/${id}`,
  documentVideo: (id: string) => `/documents/${id}/video`,
}