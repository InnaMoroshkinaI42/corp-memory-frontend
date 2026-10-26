import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { allSettled } from 'effector'
import { scope } from '@/shared/config'
import { App, appStarted } from './app'
import './app/styles'

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./shared/api/mocks/browser')
    return worker.start()
  }
}

await enableMocking()
await allSettled(appStarted, { scope })

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <App scope={scope} />
  </StrictMode>
)