# Expense Tracker

A simple browser-based expense tracker. Record spending with amount, description, and date; data persists in your browser's local storage; review totals and line items in a monthly summary view.

## Features

- Add, edit, and delete expenses
- Dates default to today (future dates are not allowed)
- Expense list sorted newest-first
- Monthly summary with year/month picker, total, and breakdown table
- No account or server — data stays on your device

## Data storage

All expenses are stored under the `localStorage` key `expense-tracker:v1` in JSON format. Data is **browser-local only**: clearing site data, using another browser, or another device will not share your expenses. There is no cloud backup in this version.

## Run locally

ES modules require serving over HTTP (opening `index.html` as a `file://` URL may block imports in some browsers).

**Option 1 — npx serve:**

```bash
npx serve .
```

Then open the URL shown (e.g. `http://localhost:3000`).

**Option 2 — Python:**

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

**Option 3 — VS Code / Cursor:** Use a “Live Server” or similar static server extension pointed at the project root.

## Project structure

```
index.html       # App shell and views
css/styles.css   # Layout and components
js/
  app.js         # Init, navigation, form and list wiring
  storage.js     # localStorage load/save
  expenses.js    # Validation and CRUD
  summary.js     # Monthly aggregation and table
  ui.js          # Formatting and form error helpers
```

## OpenSpec

This app was built from the `expense-tracker-app` change under `openspec/changes/expense-tracker-app/`.
