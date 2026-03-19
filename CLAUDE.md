# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

aRPG Timeline is a dashboard for tracking seasons and events across multiple action RPGs (Path of Exile, Diablo, Last Epoch, etc.). It displays season dates/countdowns, Twitch integration, calendar exports, and embeddable widgets.

## Repository Structure

This is a monorepo with three independent packages:

- **`arpg-timeline/`** — Main Next.js 15 public-facing website
- **`studio-arpg-timeline/`** — Sanity CMS studio for content management (games, seasons, events)
- **`scripts/crawler/`** — Automated crawler that monitors games and sends Discord notifications

Each package has its own `package.json` and is developed independently (no root-level workspace tooling).

## Commands

### Main App (`arpg-timeline/`)

```bash
npm run dev          # Dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript (tsc --noEmit)
npm run format:all   # lint:fix + prettier (run before committing)
```

### Sanity Studio (`studio-arpg-timeline/`)

```bash
npm run dev          # Dev studio
npm run build        # Build studio
npm run deploy       # Deploy to Sanity
npm run typecheck    # TypeScript check
```

### Crawler (`scripts/crawler/`)

```bash
npm run crawl          # Build + run (uses env vars from environment)
npm run crawl:develop  # Build + run with local .env file
```

## Code Style & Contribution

- Husky pre-commit hooks enforce formatting — always run `npm run format:all` before committing in `arpg-timeline/`
- Use shadcn/ui as the starting point for new UI components
- Maintain full backward compatibility; no dependency changes without discussion
- Path alias `@/*` maps to `./src/*` in the main app

## Architecture: Main App (`arpg-timeline/src/`)

**App Router structure:**

- `app/(site)/` — Main site with shared layout (dashboard, game pages, FAQ, privacy, docs)
- `app/api/v1/` — Public API endpoints
- `app/api/webhook/` — Sanity webhook handlers that trigger ISR revalidation
- `app/api/cron/` — Scheduled tasks (Vercel cron)
- `app/embed/` — Embeddable countdown and season widgets (CSP headers configured to allow embedding)
- `app/calendar/subscribe/` — iCalendar subscription endpoints

**Source directories:**

- `components/` — Feature-specific React components
- `ui/` — Base UI component library (shadcn/ui-based)
- `hooks/` — Custom React hooks
- `contexts/` — React context providers (filters, preferences, etc.)
- `lib/` — Sanity client setup and data fetching utilities
- `types/` — TypeScript type definitions
- `utils/` — Helper functions

**Data flow:** Sanity CMS → Sanity webhooks → API revalidation → Next.js ISR cache → React components.

**Key config notes:**

- `next.config.ts` sets aggressive cache headers for static assets and shorter TTLs for dynamic content
- CSP headers block embedding everywhere except `/embed/` routes
- Image optimization is configured for Sanity CDN (`cdn.sanity.io`)

## Environment Variables

The main app requires these in `.env.local`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- Discord, GitHub, Patreon URLs; Google verification; affiliate tokens
