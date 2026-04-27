# Relay API Docs — PRD

## Original Problem
Build a modern, developer-focused API Documentation Web Application **strictly in Angular (17+, standalone components)** — similar to Stripe / Postman / Swagger UI. Tailwind for styling, dynamic routing, collapsible sidebar, terminal-style code blocks with copy + syntax highlighting, multi-language tabs (cURL / JSON / TypeScript / Python / Node.js), dark/light toggle, API versioning (v1/v2), auth-gated endpoints, try-it mock execution, search.

## User Choices (2026-02-27)
- Angular-only frontend (no backend)
- Rich demo dataset (Users, Transactions, Auth, Webhooks)
- Dark/light toggle (dark default)
- Code tabs: cURL, JSON, TypeScript, Python, Node.js
- All optional features enabled (versioning, auth visibility, try-it mock)

## Architecture
- Angular 17.3 (standalone components, lazy-loaded pages)
- Tailwind 3.4 + custom CSS variables for dark/light themes
- Signal-based services (no HTTP — in-memory dataset)
- Supervisor runs: `ng serve --host 0.0.0.0 --port 3000 --allowed-hosts .emergentcf.cloud --allowed-hosts .emergentagent.com --allowed-hosts localhost`
- No backend / MongoDB usage

### Folder Structure
```
frontend/src/app/
├── app.component.ts
├── app.config.ts
├── app.routes.ts
├── data/api-data.ts            # rich v1+v2 dataset
├── services/
│   ├── api-docs.service.ts     # modules + search + version signals
│   ├── theme.service.ts        # dark/light
│   └── auth.service.ts         # signed-in flag
├── utils/
│   ├── code-samples.ts         # cURL/TS/Node/Python generators
│   └── highlight.ts            # JSON + light syntax highlighter
├── components/
│   ├── sidebar/
│   ├── topbar/
│   ├── method-badge/
│   ├── code-block/             # terminal tabs + copy
│   └── try-it/
└── pages/
    ├── home/
    └── endpoint/
```

## Implemented (2026-02-27)
- [x] Angular 17 scaffold replacing React
- [x] Left collapsible sidebar with module sections, search, version selector, auth state
- [x] Dynamic route `/docs/:module/:endpoint` with lazy loading
- [x] Endpoint page: title, description, HTTP method badge, route card, headers table, query params table, request body, success/error responses, status codes, try-it
- [x] Sticky code column (request + response preview)
- [x] Terminal-style code block with tabs (cURL / TypeScript / Node.js / Python / JSON), copy button, JSON syntax highlighting
- [x] Dark + light themes with CSS variables, toggle in topbar
- [x] API v1/v2 switch filters endpoints (v2 adds `Refund Transaction`, `Rotate Secret`)
- [x] Auth-gated endpoints hidden/locked when signed out
- [x] Try-it mock runner with simulated latency + random 4xx/2xx
- [x] Premium design: Instrument Serif display, Geist sans, JetBrains Mono, grain overlay
- [x] 17 endpoints across 4 modules (Users, Transactions, Auth, Webhooks)

## Next Actions / Backlog
- P1: Mobile-first sidebar drawer (currently hidden on `<md`)
- P1: Persist sidebar collapse state per module in localStorage
- P2: Markdown-driven long descriptions per endpoint
- P2: OpenAPI/Swagger import to replace static dataset
- P2: Real playground with workspace API key storage
- P2: Keyboard-driven command palette (Cmd-K)
