import { LoginPage, RegisterPage } from '@/pages/auth'
import type { IRoute } from './types'
import { ProfilePage } from '@/pages/profile'

export const publicRoutes: IRoute[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/profile', element: <ProfilePage /> },
]

export const protectedRoutes: IRoute[] = [
 
]