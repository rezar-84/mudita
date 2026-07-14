# Project Review — July 2026

A product/UX/opsec/developer review of the MudiNeon neon designer, written so an
agent (or developer) can pick up any item and fix it without re-deriving context.

## Documents

- **[findings.md](./findings.md)** — every issue, with severity, evidence (file:line),
  why it matters, and the fix direction. Read this to understand _what_ is wrong.
- **[remediation-plan.md](./remediation-plan.md)** — ordered, agent-ready tasks with
  concrete steps and acceptance criteria. Read this to _do_ the work.

## How to use this with an agent

1. Pick a task ID (e.g. `SEC-1`) from `remediation-plan.md`.
2. The task lists the files to touch, the change, and how to verify.
3. Each task is self-contained and independently shippable unless it declares a
   dependency. Do them in the listed order for the smoothest path.
4. After code changes, run `npx tsc --noEmit` and `npm run lint` before declaring done.

## Severity legend

| Level       | Meaning                                                            |
| ----------- | ------------------------------------------------------------------ |
| 🔴 Critical | Security hole or a broken core funnel. Fix before any real launch. |
| 🟠 High     | Real user/business impact; fix soon.                               |
| 🟡 Medium   | Quality/robustness; schedule it.                                   |
| 🟢 Low      | Polish / nice-to-have.                                             |

## Snapshot of the biggest risks

1. `SEC-1` — Stored/reflected XSS through share links + uploaded SVG decorations (🔴).
2. `PM-1` — `/yukle` quote form silently discards every lead (🔴 funnel).
3. `PM-2` — Checkout has no working payment or contact path (🔴 funnel).
4. `SEC-2` — `.env` is committed to git (🟠).
5. `DEV-1` — Server trusts client-sent order prices (🟠, blocks taking payment safely).
</content>
