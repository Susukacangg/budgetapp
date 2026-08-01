import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Code,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  computeDAGLayout,
  mergeStyle,
  useHostTheme,
} from "cursor/canvas";

const MODULE_NODES = [
  { id: "app" },
  { id: "accounts" },
  { id: "budgets" },
  { id: "transactions" },
  { id: "categories" },
  { id: "reports" },
  { id: "money" },
  { id: "ledger" },
  { id: "infra" },
  { id: "ui" },
];

const MODULE_EDGES = [
  { from: "app", to: "accounts" },
  { from: "app", to: "budgets" },
  { from: "app", to: "transactions" },
  { from: "app", to: "categories" },
  { from: "app", to: "reports" },
  { from: "accounts", to: "money" },
  { from: "budgets", to: "money" },
  { from: "transactions", to: "money" },
  { from: "transactions", to: "ledger" },
  { from: "budgets", to: "ledger" },
  { from: "reports", to: "ledger" },
  { from: "accounts", to: "infra" },
  { from: "transactions", to: "infra" },
  { from: "budgets", to: "infra" },
  { from: "categories", to: "infra" },
  { from: "app", to: "ui" },
  { from: "accounts", to: "ui" },
  { from: "budgets", to: "ui" },
  { from: "transactions", to: "ui" },
  { from: "categories", to: "ui" },
  { from: "reports", to: "ui" },
];

const MODULE_META: Record<
  string,
  { label: string; layer: string; purpose: string }
> = {
  app: {
    label: "app",
    layer: "shell",
    purpose: "Routes, providers, layout shell",
  },
  accounts: {
    label: "accounts",
    layer: "feature",
    purpose: "Cash / credit / savings accounts",
  },
  budgets: {
    label: "budgets",
    layer: "feature",
    purpose: "Period envelopes & allocations",
  },
  transactions: {
    label: "transactions",
    layer: "feature",
    purpose: "Income, expense, transfers",
  },
  categories: {
    label: "categories",
    layer: "feature",
    purpose: "Taxonomy for spend & income",
  },
  reports: {
    label: "reports",
    layer: "feature",
    purpose: "Balances, burn, period summaries",
  },
  money: {
    label: "domain/money",
    layer: "domain",
    purpose: "Amount + currency, rounding",
  },
  ledger: {
    label: "domain/ledger",
    layer: "domain",
    purpose: "Double-entry posts & balances",
  },
  infra: {
    label: "infrastructure",
    layer: "infra",
    purpose: "Storage, clock, IDs, audit",
  },
  ui: {
    label: "shared/ui",
    layer: "shared",
    purpose: "Reusable presentational pieces",
  },
};

function ModuleGraph() {
  const theme = useHostTheme();
  const layout = computeDAGLayout({
    nodes: MODULE_NODES,
    edges: MODULE_EDGES,
    direction: "vertical",
    nodeWidth: 132,
    nodeHeight: 44,
    rankGap: 56,
    nodeGap: 20,
    padding: 12,
  });

  const layerFill = (layer: string) => {
    switch (layer) {
      case "shell":
        return theme.accent.primary;
      case "feature":
        return theme.fill.secondary;
      case "domain":
        return theme.fill.tertiary;
      case "infra":
        return theme.fill.tertiary;
      case "shared":
        return theme.fill.secondary;
      default:
        return theme.fill.secondary;
    }
  };

  const layerStroke = (layer: string) => {
    switch (layer) {
      case "shell":
        return theme.accent.primary;
      case "domain":
        return theme.stroke.secondary;
      default:
        return theme.stroke.tertiary;
    }
  };

  const labelColor = (layer: string) =>
    layer === "shell" ? theme.text.onAccent : theme.text.primary;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      style={{ display: "block", maxWidth: 720 }}
    >
      {layout.edges.map((e) => (
        <line
          key={`${e.from}-${e.to}`}
          x1={e.sourceX}
          y1={e.sourceY}
          x2={e.targetX}
          y2={e.targetY}
          stroke={theme.stroke.secondary}
          strokeWidth={1.25}
          strokeDasharray={e.isBackEdge ? "4 3" : undefined}
        />
      ))}
      {layout.nodes.map((n) => {
        const meta = MODULE_META[n.id];
        return (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={132}
              height={44}
              rx={6}
              fill={layerFill(meta.layer)}
              stroke={layerStroke(meta.layer)}
              strokeWidth={1}
            />
            <text
              x={n.x + 66}
              y={n.y + 18}
              textAnchor="middle"
              fill={labelColor(meta.layer)}
              fontSize={11}
              fontWeight={600}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {meta.label}
            </text>
            <text
              x={n.x + 66}
              y={n.y + 33}
              textAnchor="middle"
              fill={
                meta.layer === "shell"
                  ? theme.text.onAccent
                  : theme.text.tertiary
              }
              fontSize={9}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {meta.layer}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TreeLine({ children }: { children: string }) {
  const theme = useHostTheme();
  return (
    <Text
      as="span"
      size="small"
      style={mergeStyle({
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        whiteSpace: "pre",
        color: theme.text.secondary,
        display: "block",
        lineHeight: 1.55,
      })}
    >
      {children}
    </Text>
  );
}

export default function BudgetappModuleOrganization() {
  const theme = useHostTheme();

  return (
    <Stack gap={28} style={{ padding: 24, maxWidth: 960 }}>
      <Stack gap={8}>
        <H1>budgetapp — module organization</H1>
        <Text tone="secondary">
          Vite + React + TypeScript scaffold today. Recommended shape below is
          domain-first so money math stays pure, auditable, and testable without
          UI entanglement.
        </Text>
        <Row gap={8} wrap>
          <Pill tone="info" active>
            SPA · client-first
          </Pill>
          <Pill tone="neutral">financial-grade money layer</Pill>
          <Pill tone="success">src layout applied</Pill>
        </Row>
      </Stack>

      <Grid columns={3} gap={12}>
        <Stat value="18" label="Tracked root entries" />
        <Stat value="7" label="Keep as-is" tone="success" />
        <Stat value="8" label="Replace or delete" tone="warning" />
      </Grid>

      <Callout tone="info" title="Organizing principle">
        Split by domain capability (accounts, budgets, transactions), not by
        technical layer alone. Pure money/ledger code lives under{" "}
        <Code>domain/</Code> with no React imports. Features compose domain +
        infrastructure + shared UI.
      </Callout>

      <Stack gap={10}>
        <H2>Recommended dependency flow</H2>
        <Text tone="secondary" size="small">
          Arrows mean “depends on”. Features may use domain and infra; domain
          must never import React or features.
        </Text>
        <Card>
          <CardBody>
            <ModuleGraph />
          </CardBody>
        </Card>
        <Row gap={12} wrap>
          <Row gap={6} align="center">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: theme.accent.primary,
              }}
            />
            <Text size="small" tone="secondary">
              shell
            </Text>
          </Row>
          <Row gap={6} align="center">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: theme.fill.secondary,
                border: `1px solid ${theme.stroke.tertiary}`,
              }}
            />
            <Text size="small" tone="secondary">
              feature / shared
            </Text>
          </Row>
          <Row gap={6} align="center">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: theme.fill.tertiary,
                border: `1px solid ${theme.stroke.secondary}`,
              }}
            />
            <Text size="small" tone="secondary">
              domain / infra
            </Text>
          </Row>
        </Row>
      </Stack>

      <Stack gap={10}>
        <H2>Suggested tree & naming</H2>
        <Grid columns="1.1fr 1fr" gap={16}>
          <Card>
            <CardHeader>Target layout</CardHeader>
            <CardBody>
              <Stack gap={0}>
                <TreeLine>src/</TreeLine>
                <TreeLine>├── app/                 # shell</TreeLine>
                <TreeLine>│   ├── App.tsx</TreeLine>
                <TreeLine>│   ├── routes.tsx</TreeLine>
                <TreeLine>│   └── providers.tsx</TreeLine>
                <TreeLine>├── features/</TreeLine>
                <TreeLine>│   ├── accounts/</TreeLine>
                <TreeLine>│   ├── budgets/</TreeLine>
                <TreeLine>│   ├── transactions/</TreeLine>
                <TreeLine>│   ├── categories/</TreeLine>
                <TreeLine>│   └── reports/</TreeLine>
                <TreeLine>├── domain/</TreeLine>
                <TreeLine>│   ├── money/           # Amount, Currency</TreeLine>
                <TreeLine>│   └── ledger/          # posts, balances</TreeLine>
                <TreeLine>├── infrastructure/</TreeLine>
                <TreeLine>│   ├── persistence/</TreeLine>
                <TreeLine>│   ├── clock.ts</TreeLine>
                <TreeLine>│   ├── id.ts</TreeLine>
                <TreeLine>│   └── audit/</TreeLine>
                <TreeLine>├── shared/</TreeLine>
                <TreeLine>│   ├── ui/</TreeLine>
                <TreeLine>│   └── format/</TreeLine>
                <TreeLine>├── main.tsx</TreeLine>
                <TreeLine>└── index.css</TreeLine>
              </Stack>
            </CardBody>
          </Card>

          <Stack gap={12}>
            <Card>
              <CardHeader>Per-feature package shape</CardHeader>
              <CardBody>
                <Stack gap={0}>
                  <TreeLine>features/transactions/</TreeLine>
                  <TreeLine>├── model.ts      # types, Zod schemas</TreeLine>
                  <TreeLine>├── service.ts    # use-cases</TreeLine>
                  <TreeLine>├── repository.ts # persistence port</TreeLine>
                  <TreeLine>├── components/   # screens & forms</TreeLine>
                  <TreeLine>└── index.ts      # public exports</TreeLine>
                </Stack>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Naming rules</CardHeader>
              <CardBody>
                <Stack gap={8}>
                  <Text size="small">
                    Folders: plural nouns for collections (
                    <Code>accounts</Code>, <Code>transactions</Code>).
                  </Text>
                  <Text size="small">
                    Money types: <Code>Money</Code> / <Code>Amount</Code> +{" "}
                    <Code>currencyCode</Code> — never bare{" "}
                    <Code>number</Code>.
                  </Text>
                  <Text size="small">
                    Files: <Code>kebab-case</Code> for multi-word modules; React
                    components <Code>PascalCase.tsx</Code>.
                  </Text>
                  <Text size="small">
                    Avoid catch-alls: no <Code>utils/</Code>,{" "}
                    <Code>helpers/</Code>, or <Code>managers/</Code>.
                  </Text>
                  <Text size="small">
                    Side effects visible in names:{" "}
                    <Code>recordTransaction</Code>,{" "}
                    <Code>appendAuditEntry</Code>.
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        </Grid>
      </Stack>

      <Stack gap={10}>
        <H2>What each module owns</H2>
        <Table
          headers={["Module", "Owns", "Must not"]}
          columnAlign={["left", "left", "left"]}
          rows={[
            [
              "domain/money",
              "Decimal amounts, currency pairing, explicit rounding",
              "UI, storage, network, Date.now()",
            ],
            [
              "domain/ledger",
              "Balanced posts, account balance derivation, invariants",
              "React, feature screens, soft “fixes”",
            ],
            [
              "features/*",
              "Screens, forms, feature schemas, orchestration",
              "Raw float math; cross-feature deep imports",
            ],
            [
              "infrastructure",
              "localStorage/IndexedDB/API, clock, IDs, audit trail",
              "Business rules beyond persistence mapping",
            ],
            [
              "shared/ui",
              "Buttons, inputs, layout primitives, money display",
              "Domain writes or feature-specific workflows",
            ],
            [
              "app",
              "Routing, providers, global error boundary",
              "Domain calculations",
            ],
          ]}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Critical review of files present now</H2>
        <Text tone="secondary">
          Current repo is the default Vite React TS template. Almost nothing is
          budget-domain yet — keep the toolchain, strip the demo, rewrite the
          app shell.
        </Text>

        <H3>Keep — required toolchain</H3>
        <Table
          headers={["Path", "Verdict", "Purpose"]}
          rowTone={[
            "success",
            "success",
            "success",
            "success",
            "success",
            "success",
            "success",
          ]}
          rows={[
            [
              "package.json / package-lock.json",
              "Keep",
              "Dependency manifest & lockfile; rename scripts/docs as app grows",
            ],
            [
              "vite.config.ts",
              "Keep",
              "Dev server & bundler entry for the SPA",
            ],
            [
              "tsconfig.json + tsconfig.app/node.json",
              "Keep",
              "TypeScript project split for app vs Vite config",
            ],
            [
              "eslint.config.js",
              "Keep",
              "Lint boundary; tighten to type-aware rules later",
            ],
            [
              "index.html",
              "Keep (edit)",
              "HTML shell; update title/favicon to budgetapp branding",
            ],
            [
              "src/main.tsx",
              "Keep",
              "React bootstrap — only permanent app entry",
            ],
            [
              ".gitignore",
              "Keep",
              "Correctly ignores node_modules, dist, .idea",
            ],
          ]}
          striped
        />

        <H3>Replace — scaffold that must become product code</H3>
        <Table
          headers={["Path", "Verdict", "Why"]}
          rowTone={["warning", "warning", "warning", "warning"]}
          rows={[
            [
              "src/App.tsx",
              "Replace",
              "Vite counter/docs demo. Should become app shell or move under app/App.tsx",
            ],
            [
              "src/App.css",
              "Delete after rewrite",
              "Template-only styles; replace with shared theme / feature CSS",
            ],
            [
              "src/index.css",
              "Rewrite",
              "Global tokens/reset are needed; current content is Vite demo look",
            ],
            [
              "README.md",
              "Rewrite",
              "Still Vite plugin docs; should describe budget domain & runbook",
            ],
          ]}
          striped
        />

        <H3>Delete — not needed for budgetapp</H3>
        <Table
          headers={["Path", "Verdict", "Why"]}
          rowTone={["danger", "danger", "danger", "danger"]}
          rows={[
            [
              "src/assets/react.svg, vite.svg, hero.png",
              "Delete",
              "Marketing/demo assets; no role in budgeting UX",
            ],
            [
              "public/icons.svg",
              "Delete",
              "Vite community icon sprite for template links only",
            ],
            [
              "public/favicon.svg",
              "Replace",
              "Keep a favicon slot; current mark is Vite’s, not yours",
            ],
            [
              "budgetapp.iml + .idea/",
              "Ignore (already)",
              "JetBrains local project metadata — not source of truth",
            ],
          ]}
          striped
        />

        <H3>Generated / install artifacts</H3>
        <Table
          headers={["Path", "Verdict", "Why"]}
          rowTone={["neutral", "neutral"]}
          rows={[
            [
              "node_modules/",
              "Never commit",
              "Install from lockfile; required at runtime for deps only",
            ],
            [
              "dist/",
              "Never commit",
              "Build output; regenerate via npm run build",
            ],
          ]}
          striped
        />
      </Stack>

      <Callout tone="warning" title="Immediate gap vs financial-grade bar">
        There is no money type, ledger, schema validation, audit trail, or
        injectable clock yet. Before UI polish, introduce{" "}
        <Code>domain/money</Code> (decimal + currency) and persistence behind an
        idempotency-aware service boundary — otherwise float and ad-hoc state
        will bake into the UI.
      </Callout>

      <Stack gap={8}>
        <H2>Suggested first build order</H2>
        <Table
          headers={["Step", "Deliverable", "Why first"]}
          rows={[
            [
              "1",
              "domain/money + tests",
              "Every screen will display or mutate amounts",
            ],
            [
              "2",
              "infrastructure/clock, id, audit",
              "Deterministic tests & append-only history",
            ],
            [
              "3",
              "features/accounts + transactions",
              "Core write path for the budget loop",
            ],
            [
              "4",
              "features/budgets + categories",
              "Planning layer on top of posted activity",
            ],
            [
              "5",
              "features/reports + shared/ui money display",
              "Read models once writes are trustworthy",
            ],
          ]}
          striped
        />
      </Stack>
    </Stack>
  );
}
