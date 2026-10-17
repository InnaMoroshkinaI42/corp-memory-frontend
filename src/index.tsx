import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { allSettled } from 'effector'
import { scope } from '@/shared/config'
import { App, appStarted } from './app'

await allSettled(appStarted, { scope })

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <App scope={scope} />
  </StrictMode>
)