import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'effector-react'
import { BrowserRouter } from 'react-router-dom'
import type { Scope } from 'effector'
import { Router } from './router'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
})

type AppProps = {
  scope: Scope
}

export const App = ({ scope }: AppProps) => {
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

export { appStarted } from './init'