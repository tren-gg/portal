# Conventions

## Server vs client components

Default to server components. Use `"use client"` only when the component needs browser APIs, event handlers, or React hooks (useState, useEffect, etc.). The authed layout and individual pages are server components that fetch data directly. The sign-in form and nav are client components.

## API calls

All API calls go through `lib/api/client.ts` which runs server-side only. The browser never holds API tokens. Use `apiFetch<T>()` for authenticated requests — it handles token refresh automatically.

## Session management

Two iron-session cookies:
- Main session (`tren_portal_session`): holds tokens and user info for the duration of the browser session
- PKCE cookie (`tren_pkce`): short-lived (15 min), holds PKCE verifier and state during the sign-in flow

## Styling

- Tailwind CSS v4 with shadcn/ui components
- Dark theme only — colors are defined as CSS custom properties in `globals.css` matching Tren's brand palette (#070708 background, white foreground, #2d2d34 borders)
- No `dark:` prefixed utilities needed; the root theme is already dark

## Component patterns

- shadcn/ui primitives in `components/ui/` — don't modify these directly
- App-specific components in `components/` — use shadcn primitives as building blocks
- For links styled as buttons, use `buttonVariants()` className on `<Link>` or `<a>` elements (no `asChild` — the current shadcn version uses Base UI, not Radix)
- For dropdown menu items that are links, use the `render` prop: `<DropdownMenuItem render={<Link href="..." />}>`

## Error handling

- Auth errors (missing/invalid session) trigger a redirect to `/auth/sign-in` via the `requireSession()` guard
- API errors throw `ApiError` with status and body; pages should catch and display inline alerts
- The API client retries once on 401 after refreshing tokens

## File naming

- `kebab-case` for all files and directories
- Route handlers use `route.ts`
- Pages use `page.tsx`
- Layouts use `layout.tsx`
- Server actions are defined inline in page files, not in separate files

## Accessibility

- All interactive elements must be keyboard accessible
- Use semantic HTML elements
- Form inputs must have associated labels
- Disabled buttons should have `title` attributes explaining why they're disabled
