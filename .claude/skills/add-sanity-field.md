# Add Sanity Field Skill

Add a new field to a Sanity document schema and propagate it through the full data pipeline to the React components.

## Files to touch (in order)

| Step | File | What to do |
|------|------|------------|
| 1 | `studio-arpg-timeline/schemaTypes/schemas/<document>.ts` | Add field definition |
| 2 | `arpg-timeline/src/lib/cms/queries/indexQuery.ts` (GROQ) | Project the field in both `indexQuery` and `gameDetailsQuery` |
| 3 | `arpg-timeline/src/lib/cms/queries/indexQuery.ts` (types) | Add to the relevant `interface` |
| 4 | `arpg-timeline/src/lib/cms/games.types.ts` | Add to the component-facing type |
| 5 | `arpg-timeline/src/lib/cms/parseGamesFromSanity.ts` | Pass through or transform if needed |
| 6 | Consuming component(s) | Read and use the field |

**Always read each file before editing it.**

---

## Step 1 — Sanity schema

File: `studio-arpg-timeline/schemaTypes/schemas/season.ts` (or the relevant document type).

Add the field inside the appropriate `fields` array or nested `object.fields`:

```ts
{
    name: "myField",
    title: "My Field",
    type: "boolean",           // or "string", "number", "datetime", etc.
    initialValue: false,
    description: "One sentence explaining what this controls.",
},
```

Place it near logically related fields. For `start`/`end` objects, add inside their `fields` array.

---

## Step 2 — GROQ projections

File: `arpg-timeline/src/lib/cms/queries/indexQuery.ts`

There are **two queries** that both need updating: `indexQuery` and `gameDetailsQuery`. Each has the same `start { … }` / `end { … }` projection blocks. Add the field to all matching blocks:

```groq
start {
  startDate,
  confirmed,
  myField,        // ← add here
  overrideText,
  additionalText
},
```

Also update the standalone `"seasons"` projection if the field is relevant there too.

---

## Step 3 — Sanity response type

In the same file, update the matching interface:

- `SeasonStartDateInfo` for `start` fields
- `SeasonEndDateInfo` for `end` fields

```ts
export interface SeasonStartDateInfo {
    startDate?: string;
    confirmed?: boolean;
    myField?: boolean;    // ← add here
    overrideText?: string;
    additionalText?: string;
}
```

---

## Step 4 — Component-facing type

File: `arpg-timeline/src/lib/cms/games.types.ts`

Add to `BaseSeasonDate` (shared by both `SeasonStart` and `SeasonEnd`) or directly to `SeasonStart` / `SeasonEnd` if the field is specific to one:

```ts
export type BaseSeasonDate = {
    confirmed?: boolean | null | undefined;
    myField?: boolean | null | undefined;   // ← add here
    overrideText?: string | null | undefined;
    additionalText?: string | null | undefined;
};
```

---

## Step 5 — parseGamesFromSanity

File: `arpg-timeline/src/lib/cms/parseGamesFromSanity.ts`

**Usually no change needed** — when `game.nextSeason = gameSeasons[0]` the real Sanity data flows through automatically.

Only touch this file if:
- The field needs transformation (e.g. a date offset calculation)
- The field must be present on the **synthetic** `nextSeason` object built in the `hasLatestSeasonStarted` branch (lines ~123–149)

If the latter, add the field to that object literal explicitly.

---

## Step 6 — Consuming component

The main rendering component is `arpg-timeline/src/hoc/GameToSeasonWidget/Content.tsx`.

Access via `season.start?.myField` or `season.end?.myField`. Example pattern:

```tsx
<Countdown
    date={new Date(season.start.startDate)}
    variant={season.start.myField ? "days" : "full"}
/>
```

If the field affects other components (embeds, stream cards, game details page), update those too.

---

## Checklist

- [ ] Studio schema updated
- [ ] Both GROQ queries updated (`indexQuery` + `gameDetailsQuery`)
- [ ] `SeasonStartDateInfo` / `SeasonEndDateInfo` interface updated
- [ ] `games.types.ts` type updated
- [ ] `parseGamesFromSanity.ts` checked (update only if needed)
- [ ] Consuming component(s) updated
