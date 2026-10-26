import { LoginPage, RegisterPage } from '@/pages/auth'
import type { IRoute } from './types'

export const publicRoutes: IRoute[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
]

export const protectedRoutes: IRoute[] = [
 
]