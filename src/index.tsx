import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { allSettled } from 'effector'
import { scope } from '@/shared/config'
import { App, appStarted } from './app'
import './app/styles'

async function enableMocking() {
  const { worker } = await import('./shared/api/mocks/browser')
  return worker.start({
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      options: {
        scope: import.meta.env.BASE_URL,
      },
    },
  })
}

await enableMocking()
await allSettled(appStarted, { scope })

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <App scope={scope} />
  </StrictMode>
)