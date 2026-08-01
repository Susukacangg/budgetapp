# budgetapp

Personal budgeting SPA (React + TypeScript + Vite).

## Layout

See `docs/module-organization.canvas.tsx` for the module map. Source mirrors that layout:

```text
src/
├── app/                 # shell, routes, providers
├── features/            # accounts, budgets, transactions, categories, reports
├── domain/              # money, ledger (no React)
├── infrastructure/      # clock, ids, audit, persistence
├── shared/              # ui, format
├── main.tsx
└── index.css
```

## Scripts

- `npm run dev` — local dev server
- `npm run build` — typecheck + production build
- `npm run lint` — ESLint
- `npm run preview` — preview production build
