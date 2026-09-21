# EVLV Website

Marketing site and onboarding portal for **EVLV**, a talent management agency serving the SWANA region.
Visitors can browse the agency's services and register as a **Talent**, **Brand** or **Agency**; registrations are validated and forwarded to a webhook (Pipedream).

## Highlights

- Pinned scroll-driven hero animation (GSAP ScrollTrigger)
- Full-viewport WebGL2 "aurora" background (no runtime graphics dependency)
- Data-driven registration forms, validated on the client **and** the server from one shared schema
- Express API with rate limiting, security headers (Helmet + CSP), compression and graceful shutdown
- The webhook URL lives only on the server, never in the browser bundle
- Lint, format check, tests and build run in CI on every push

## Tech stack

| Layer    | Tools                                                           |
| -------- | --------------------------------------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS 3, GSAP                            |
| Backend  | Node.js 20+, Express 5, Helmet, express-rate-limit              |
| Quality  | ESLint 9, Prettier, Node's built-in test runner, GitHub Actions |

## Getting started

**Requirements:** Node.js `>= 20.19` and npm.

```bash
git clone <your-repo-url> evlv-website
cd evlv-website
npm install

cp .env.example .env      # then set PIPEDREAM_WEBHOOK_URL (see below)
npm run dev
```

- Website (Vite, hot reload): <http://localhost:5173>
- API (Express): <http://localhost:3000>. Vite proxies `/api` to it, so there is no CORS setup.

Without a webhook URL, development mode **simulates** successful submissions and prints them to the server console, so you can work on the forms without any account.

### Production build

```bash
npm run build     # outputs to dist/
npm start         # Express serves dist/ and the API on $PORT (default 3000)
```

## Scripts

| Command              | What it does                             |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | API + Vite dev server together           |
| `npm run dev:client` | Vite only                                |
| `npm run dev:server` | Express only, restarts on file changes   |
| `npm run build`      | Production build into `dist/`            |
| `npm start`          | Serve the build + API in production mode |
| `npm test`           | Run the test suite                       |
| `npm run lint`       | ESLint (`lint:fix` to auto-fix)          |
| `npm run format`     | Prettier (`format:check` to verify only) |

## Environment variables

Copy `.env.example` to `.env`. The `.env` file is git-ignored; **never commit it**.

| Variable                | Default       | Description                                                                                    |
| ----------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `PORT`                  | `3000`        | Port the Express server listens on                                                             |
| `NODE_ENV`              | `development` | `npm start` sets `production` automatically                                                    |
| `PIPEDREAM_WEBHOOK_URL` | _(empty)_     | HTTPS webhook receiving registrations. Empty: dev simulates success, production responds `503` |
| `RATE_LIMIT_MAX`        | `10`          | Max registration submissions per IP per 15 minutes                                             |
| `TRUST_PROXY`           | `0`           | Set to `1` behind a reverse proxy / load balancer so rate limiting sees real client IPs        |

## Project structure

```text
.
├── index.html                  Vite entry (fonts, meta tags)
├── public/                     Static files served as-is (favicon)
├── shared/
│   └── registration.js         Form definitions + validation, used by client AND server
├── server/
│   ├── index.js                Boots the HTTP server, graceful shutdown
│   ├── app.js                  Express app: security headers, static files, routes
│   ├── config.js               Reads and validates environment variables
│   ├── routes/                 /api/health, /api/register
│   ├── middleware/             Rate limiter, error handling
│   ├── services/webhook.js     Delivers submissions to the webhook
│   └── utils/httpError.js
├── src/
│   ├── main.jsx · App.jsx
│   ├── components/
│   │   ├── layout/             Navbar, Footer, AuroraBackground, CornerLogo
│   │   ├── sections/           Hero, JoinSection, ServicesSection, AboutSection
│   │   ├── registration/       Modal, FormField, success state
│   │   └── icons/
│   ├── hooks/                  useHeroScroll, useActiveSection, useRegistrationForm
│   ├── data/                   Content: services, navigation, join options, contact details
│   ├── lib/                    API client + WebGL aurora (shaders, renderer)
│   ├── styles/                 Tokens, typography, base, navbar, hero... one file each
│   └── assets/images/          Logo
├── tests/                      Validation and API tests
└── .github/workflows/ci.yml    Lint, format check, test, build on Node 20 and 22
```

## API

### `POST /api/register`

```jsonc
{
  "registrationType": "Talent", // "Talent" | "Brand" | "Agency"
  "fullName": "Maya Khoury", // remaining fields depend on the type
  "category": "Creator", // see shared/registration.js
  "instagram": "@maya",
  "basedIn": "Amman, JO",
  "email": "maya@example.com",
  "phone": "+962 79 000 0000",
  "message": "Optional",
}
```

| Status | Meaning                                                                        |
| ------ | ------------------------------------------------------------------------------ |
| `200`  | `{ "ok": true }` delivered (`"simulated": true` when no webhook is set in dev) |
| `400`  | Validation failed: `{ ok: false, message, errors: { field: "reason" } }`       |
| `429`  | Rate limit exceeded                                                            |
| `502`  | The webhook was unreachable or rejected the request                            |
| `503`  | Production without `PIPEDREAM_WEBHOOK_URL`                                     |

The webhook receives the registration fields plus `submittedAt` (ISO timestamp, set by the server).

### `GET /api/health`

Returns `{ "ok": true, "uptime": <seconds> }` for uptime monitors.

## Customising

| I want to change...             | Edit                                                                       |
| ------------------------------- | -------------------------------------------------------------------------- |
| Services, about copy, nav links | `src/data/*`, `src/components/sections/AboutSection.jsx`                   |
| Email, locations, social links  | `src/data/site.js`                                                         |
| Registration fields or options  | `shared/registration.js` (forms **and** server validation update together) |
| Brand colours and type scale    | `tailwind.config.js` and `src/styles/tokens.css`                           |
| Aurora colours and speed        | `src/lib/aurora/defaults.js`                                               |
| Logo / favicon                  | `src/assets/images/logo.png`, `public/favicon.png`                         |

## Deployment

The form needs the Node server, so deploy the project as **one Node service** (Render, Railway, Fly.io, a VPS...):

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Environment: `PIPEDREAM_WEBHOOK_URL`, and `TRUST_PROXY=1` on platforms that sit behind a proxy

> **GitHub Pages cannot run the API.** It only hosts static files, so the registration form would not work there.

## Security notes

- Secrets live in `.env` (git-ignored). Only `.env.example` with empty values is committed.
- The webhook URL is read by the server only; it is not part of the browser bundle.
- Submissions are validated server-side (types, required fields, allowed options, lengths); unknown fields are dropped.
- Helmet sets a strict Content-Security-Policy; `/api/register` is rate limited; JSON bodies are capped at 32 KB.
- If a webhook URL was ever committed or shared publicly, **rotate it** in Pipedream.

## Brand

Colours, typography and the type scale follow the EVLV Brand Guidelines: Poppins (primary) and Inter (secondary). Tokens are in `src/styles/tokens.css` and mirrored in `tailwind.config.js`.

© EVLV Global. All rights reserved.
