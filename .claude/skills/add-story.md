# Add Story Skill

Add a new Storybook story (or stories) to document a component variant.

## Process

1. **Identify the target component** from the user's request.
2. **Read the component file** to understand its props interface.
3. **Read the existing stories file** if one exists (same directory, `ComponentName.stories.tsx`), so you can follow the established patterns and avoid duplicates. If no file exists, create one from scratch.
4. **Write the story** following the conventions below.
5. **Do not run the dev server** — just write the file.

## Project Conventions

### File location
- Co-located with the component: `src/components/ComponentName/ComponentName.stories.tsx`
- If the component is a single file (e.g. `src/components/Countdown.tsx`), place stories at `src/components/Countdown.stories.tsx`

### Imports
```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
```

### Meta block
```tsx
const meta: Meta<typeof ComponentName> = {
    component: ComponentName,
    title: "Components/ComponentName",   // match existing title prefix style
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="w-[480px]">   // adjust width to suit the component
                <Story />
            </div>
        ),
    ],
};
export default meta;
type Story = StoryObj<typeof ComponentName>;
```

### Stable mock dates
Always anchor mocks to `2026-03-21` (the project's reference "today"), never `new Date()`:
```ts
const NOW = new Date("2026-03-21T12:00:00Z");
const daysMs = (n: number) => n * 24 * 60 * 60 * 1000;
const SOON  = new Date(NOW.getTime() + daysMs(5)).toISOString();
const LATER = new Date(NOW.getTime() + daysMs(15)).toISOString();
```

### Story structure
- Each story gets a JSDoc comment explaining **when this state occurs in production**.
- Use a human-readable `name` field.
- Prefer `args` over inline JSX where the component supports it.

```tsx
/**
 * One-line description of when/why this state appears.
 */
export const MyVariant: Story = {
    name: "Human readable name",
    args: {
        // props here
    },
};
```

### Decorator overrides
If a single story needs a different wrapper (e.g. a scaled embed), add a `decorators` array on that story — it overrides the meta-level decorator for that story only.

### Dummy logo placeholder
When a game logo image is needed use:
```tsx
const Logo = ({ label }: { label: string }) => (
    <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded text-xs">
        {label}
    </div>
);
```

## What to cover

For each component, aim to document:
- The most common / happy-path state
- Edge cases (empty data, long text, missing optional props)
- Every distinct visual variant (different chip types, embed vs normal, etc.)

Keep stories focused — one observable difference per story.
