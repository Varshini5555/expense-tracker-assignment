## 1. Project scaffold



- [x] 1.1 Create `index.html` with nav between Expenses and Monthly Summary views

- [x] 1.2 Add `css/styles.css` with responsive layout, form, list, and summary table styles

- [x] 1.3 Add `js/` module files per design: `app.js`, `storage.js`, `expenses.js`, `summary.js`, `ui.js`



## 2. Local persistence layer



- [x] 2.1 Implement `storage.js` with key `expense-tracker:v1`, load/save, and versioned document shape

- [x] 2.2 Handle missing, corrupt, and invalid JSON on load (empty list, console warning)

- [x] 2.3 Validate expense objects on load (required fields: id, amount, description, date)

- [x] 2.4 Wire `storage` event listener to reload when another tab updates data (optional polish)



## 3. Expense domain and CRUD



- [x] 3.1 Implement expense model helpers: generate id, validate amount/description/date

- [x] 3.2 Implement add expense with validation and immediate save to localStorage

- [x] 3.3 Render expense list sorted by date descending with empty state

- [x] 3.4 Implement edit flow (populate form, save updates, preserve id)

- [x] 3.5 Implement delete with confirmation and save



## 4. Expense list UI



- [x] 4.1 Build add/edit form with amount, description, date (default today, max today)

- [x] 4.2 Display validation errors inline without saving invalid data

- [x] 4.3 Add edit and delete actions per list row

- [x] 4.4 Format currency display (e.g. `$12.50`)



## 5. Monthly summary view



- [x] 5.1 Add year/month selectors defaulting to current month

- [x] 5.2 Filter expenses by selected `YYYY-MM` and compute total with 2-decimal display

- [x] 5.3 Render breakdown table (date, description, amount) sorted by date ascending

- [x] 5.4 Show empty-state message when no expenses in selected month

- [x] 5.5 Ensure summary refreshes after CRUD operations on expense list



## 6. App integration and docs



- [x] 6.1 Initialize app: load storage, bind navigation, render default view

- [x] 6.2 Manual smoke test: add, edit, delete, reload page, verify summary totals

- [x] 6.3 Add `README.md` with how to run locally and note that data is browser-local only

