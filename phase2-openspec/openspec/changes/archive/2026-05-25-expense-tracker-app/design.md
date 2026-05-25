## Context

Greenfield browser application. Users record expenses locally with no backend. Data must survive refresh via `localStorage`. The proposal defines three capabilities: expense CRUD, local persistence, and monthly summary. This design keeps the stack minimal so implementation stays fast and deployable as static files.

## Goals / Non-Goals

**Goals:**

- Single-page app with two primary views: expense list (with add/edit) and monthly summary
- Vanilla HTML, CSS, and JavaScript (no build step required for v1)
- Clear module boundaries: storage layer, domain model, UI rendering
- ISO date strings (`YYYY-MM-DD`) for sorting and month grouping
- Responsive layout usable on mobile and desktop

**Non-Goals:**

- User accounts, cloud sync, or multi-device backup
- Categories, budgets, charts, or export/import
- Backend API, database, or PWA/offline service worker
- Internationalization or multi-currency beyond a single display currency (e.g. USD with `$` prefix)

## Decisions

### 1. Vanilla SPA over framework

**Choice:** Plain HTML/CSS/JS with ES modules (or a single bundled script if modules are awkward for static hosting).

**Rationale:** Scope is small (forms, list, one summary screen). No framework reduces dependencies and matches “local tool” simplicity.

**Alternatives:** React/Vue — rejected for overhead on a ~3-screen app.

### 2. Data model

**Choice:** Each expense is a JSON object:

```json
{
  "id": "uuid-v4",
  "amount": 12.50,
  "description": "Coffee",
  "date": "2026-05-25"
}
```

Root document in `localStorage` key `expense-tracker:v1`:

```json
{
  "version": 1,
  "expenses": []
}
```

**Rationale:** Version field allows future migrations. UUID `id` supports edit/delete without index instability.

### 3. Storage API

**Choice:** Thin `StorageService` with `load()`, `save(expenses)`, `getAll()`, and internal parse/validate. All UI flows go through this layer.

**Rationale:** Centralizes JSON parse errors, empty state, and schema validation.

### 4. UI structure

**Choice:**

- **Expenses view:** form (amount, description, date) + sortable list (newest date first) with edit/delete actions
- **Summary view:** month picker (year + month) + total + table of expenses in that month
- Tab or nav links to switch views; state in memory, persisted on each mutation

**Rationale:** Matches user mental model: “log spending” vs “see how much this month.”

### 5. Validation rules

**Choice:**

- Amount: positive number, max 2 decimal places, required
- Description: non-empty string, trimmed, max 200 chars
- Date: valid `YYYY-MM-DD`, not in the future (optional soft rule — allow today only as max)

**Rationale:** Prevents corrupt storage and bad summary totals.

### 6. Monthly aggregation

**Choice:** Filter expenses where `date` starts with `YYYY-MM` for selected month; sum `amount` with cent-safe arithmetic (store as number, display rounded to 2 decimals).

**Rationale:** ISO date prefix match is simple and timezone-neutral for date-only fields.

### 7. Project layout

```
/
  index.html
  css/styles.css
  js/
    app.js          # init, routing between views
    storage.js      # localStorage read/write
    expenses.js     # CRUD + validation
    summary.js      # monthly aggregation + render
    ui.js           # DOM helpers
```

**Rationale:** Separates concerns for testing and `/opsx:apply` task breakdown.

## Risks / Trade-offs

- **[Data loss on clear storage]** → Mitigation: document in README that data is browser-local only; no recovery without export (future).
- **[localStorage quota (~5MB)]** → Mitigation: sufficient for thousands of expenses; no images/binary.
- **[No sync across devices]** → Accepted non-goal; called out in UI footer or README.
- **[Date timezone edge cases]** → Mitigation: treat `date` as calendar date string only, never `Date` serialization to JSON.
- **[Concurrent tabs]** → Mitigation: `storage` event listener to reload when another tab writes (nice-to-have in tasks).

## Migration Plan

1. Add static files under project root (or `public/`).
2. Open `index.html` in browser or serve via `npx serve` / similar.
3. No deployment pipeline required for v1; optional GitHub Pages later.

Rollback: remove files; user data remains in their browser until cleared.

## Open Questions

- Default currency symbol: assume USD (`$`) unless user requests otherwise before apply.
- Sort order on expense list: default newest-first by date, then by id.
