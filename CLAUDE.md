# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

aRPG Timeline is a dashboard for tracking seasons and events across multiple action RPGs (Path of Exile, Diablo, Last Epoch, etc.). It displays season dates/countdowns, Twitch integration, calendar exports, and embeddable widgets.

## Repository Structure

This is a monorepo with two active packages:

- **`arpg-timeline/`** — Main Next.js 15 public-facing website
- **`studio-arpg-timeline/`** — Sanity CMS studio for content management (games, seasons, events)

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

## Code Style & Contribution

- Husky pre-commit hooks enforce formatting — always run `npm run format:all` before committing in `arpg-timeline/`
- Use shadcn/ui as the starting point for new UI components
- Maintain full backward compatibility; no dependency changes without discussion
- Path alias `@/*` maps to `./src/*` in the main app

## Private context

The owner's agent context (architecture notes, specs, tickets, analytics, skills) lives in a private repository cloned at `.context/` (gitignored). When it exists, read it first:

@.context/CLAUDE.md
