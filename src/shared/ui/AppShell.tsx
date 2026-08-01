import type { ReactNode } from 'react'

type AppShellProps = {
  title: string
  nav: ReactNode
  children: ReactNode
}

export function AppShell({ title, nav, children }: AppShellProps) {
  return (
    <div className="shell">
      <header className="shell-header">
        <p className="brand">{title}</p>
        <nav className="shell-nav">{nav}</nav>
      </header>
      <main className="shell-main">{children}</main>
    </div>
  )
}
