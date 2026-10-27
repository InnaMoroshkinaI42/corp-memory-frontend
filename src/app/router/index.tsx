import { Route, Routes } from 'react-router-dom'
import { publicRoutes, protectedRoutes } from './routes.model'
import type { IRoute } from './types'

const renderRoutes = (routes: IRoute[]) =>
  routes.map((route) => (
    <Route key={route.path} path={route.path} element={route.element} />
  ))

export const Router = () => {
  return (
    <Routes>
      {renderRoutes(publicRoutes)}
      {renderRoutes(protectedRoutes)}
      <Route path="*" element={<div>404</div>} />
    </Routes>
  )
}