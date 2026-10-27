import { LoginPage, RegisterPage } from '@/pages/auth'
import type { IRoute } from './types'
import { ProfilePage } from '@/pages/profile'
import { LandingPage } from '@/pages/landing'

export const publicRoutes: IRoute[] = [
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
]

export const protectedRoutes: IRoute[] = [
 { path: '/profile', element: <ProfilePage /> },
]