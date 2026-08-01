import type { ReactNode } from 'react'
import { defaultServices, type AppServices } from './services.ts'

type AppProvidersProps = {
  children: ReactNode
  services?: AppServices
}

/** Composition root for injectable infrastructure. Expand with Context as features need it. */
export function AppProviders({
  children,
  services = defaultServices,
}: AppProvidersProps) {
  void services
  return children
}
