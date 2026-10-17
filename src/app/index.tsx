import { QueryClientProvider } from '@tanstack/react-query'
import { type Scope } from 'effector'
import { Provider } from 'effector-react'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from '@/shared/api/query-client'
import { Router } from './router'

export { appStarted } from './init'

export const App = ({ scope }: { scope: Scope }) => {
  return (
    <Provider value={scope}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  )
}