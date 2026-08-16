import {useState} from 'react'
import {AppShell} from '../shared/ui'
import {AppRoutes, type AppRouteId} from './route-ids.ts'
import {RouteView} from './routes.tsx'
import type {Account} from '../features/accounts'

export default function App() {
  const [route, setRoute] = useState<AppRouteId>(import.meta.env.VITE_DEFAULT_PAGE)

  return (
    <AppShell
      title={`${import.meta.env.VITE_APP_TITLE}`}
      nav={
        <>
          {Object.values(AppRoutes).map((item) => (
            <button
              key={item}
              type="button"
              className={route === item ? 'nav-link active' : 'nav-link'}
              onClick={() => setRoute(item)}
            >
              {item}
            </button>
          ))}
        </>
      }
    >
      <RouteView route={route} />
    </AppShell>
  )
}
