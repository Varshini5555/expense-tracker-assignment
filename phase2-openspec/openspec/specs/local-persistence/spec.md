# local-persistence Specification

## Purpose
TBD - created by archiving change expense-tracker-app. Update Purpose after archive.
## Requirements
### Requirement: Expenses persist in browser local storage

The system SHALL persist all expenses in the browser's `localStorage` so data survives page reloads and browser restarts on the same origin.

#### Scenario: Data survives reload

- **WHEN** the user adds an expense and reloads the page
- **THEN** the same expense appears in the expense list

### Requirement: Storage uses versioned JSON document

The system SHALL store data under a fixed key `expense-tracker:v1` as JSON with shape `{ "version": 1, "expenses": [ ... ] }`.

#### Scenario: Load valid stored document

- **WHEN** `localStorage` contains valid JSON matching the schema
- **THEN** the system loads all expenses into application state

#### Scenario: Initialize empty document

- **WHEN** no data exists for the storage key
- **THEN** the system initializes with version `1` and an empty `expenses` array

### Requirement: Save on every mutation

The system SHALL write the full expense collection to `localStorage` immediately after add, update, or delete operations succeed.

#### Scenario: Save after add

- **WHEN** the user adds a valid expense
- **THEN** `localStorage` is updated and contains the new expense

#### Scenario: Save after delete

- **WHEN** the user deletes an expense
- **THEN** `localStorage` no longer contains that expense id

### Requirement: Corrupt storage is handled safely

The system SHALL handle invalid or unparsable stored JSON without crashing the application.

#### Scenario: Invalid JSON on load

- **WHEN** stored value is not valid JSON
- **THEN** the system SHALL reset to an empty expense list and MAY log a warning to the console

#### Scenario: Invalid expense shape on load

- **WHEN** stored JSON parses but contains expenses missing required fields (`id`, `amount`, `description`, `date`)
- **THEN** the system SHALL skip invalid entries or reset to empty, and SHALL NOT throw an uncaught error

### Requirement: Expense ids are unique

The system SHALL assign a unique identifier to each new expense at creation time.

#### Scenario: New expense gets unique id

- **WHEN** the user adds two expenses in sequence
- **THEN** each expense has a distinct id value

