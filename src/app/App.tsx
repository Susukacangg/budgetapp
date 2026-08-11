import {useState} from 'react'
import {AppShell} from '../shared/ui'
import {APP_ROUTES, type AppRouteId} from './route-ids.ts'
import {RouteView} from './routes.tsx'
import type {Account} from '../features/accounts'

export default function App() {
  const [route, setRoute] = useState<AppRouteId>('accounts')

  return (
    <AppShell
      title={`${import.meta.env.VITE_APP_TITLE}`}
      nav={
        <>
          {APP_ROUTES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={route === item.id ? 'nav-link active' : 'nav-link'}
              onClick={() => setRoute(item.id)}
            >
              {item.label}
            </button>
          ))}
        </>
      }
    >
      <RouteView route={route} />
    </AppShell>
  )
}
