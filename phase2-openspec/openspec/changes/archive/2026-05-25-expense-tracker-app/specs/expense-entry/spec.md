## ADDED Requirements

### Requirement: User can add an expense

The system SHALL allow the user to create an expense with a positive monetary amount, a non-empty description, and a calendar date.

#### Scenario: Add expense with valid fields

- **WHEN** the user enters amount `25.00`, description `Groceries`, date `2026-05-25`, and submits the form
- **THEN** a new expense is stored with a unique id and appears in the expense list

#### Scenario: Reject invalid amount

- **WHEN** the user submits the form with amount empty, zero, negative, or non-numeric
- **THEN** the system SHALL NOT save the expense and SHALL show a validation error

#### Scenario: Reject empty description

- **WHEN** the user submits the form with a blank or whitespace-only description
- **THEN** the system SHALL NOT save the expense and SHALL show a validation error

### Requirement: User can view expenses

The system SHALL display all stored expenses in a list showing amount, description, and date for each entry.

#### Scenario: List shows saved expenses

- **WHEN** at least one expense exists in storage
- **THEN** the expense list displays each expense with amount, description, and date

#### Scenario: Empty state

- **WHEN** no expenses exist in storage
- **THEN** the system SHALL show an empty-state message prompting the user to add an expense

### Requirement: User can edit an expense

The system SHALL allow the user to update amount, description, and date of an existing expense.

#### Scenario: Edit expense successfully

- **WHEN** the user selects edit on an expense, changes fields to valid values, and saves
- **THEN** the expense is updated in storage and the list reflects the new values

#### Scenario: Edit preserves id

- **WHEN** the user edits an expense and saves
- **THEN** the expense id SHALL remain unchanged

### Requirement: User can delete an expense

The system SHALL allow the user to remove an expense permanently from storage.

#### Scenario: Delete expense

- **WHEN** the user confirms delete on an expense
- **THEN** the expense is removed from storage and no longer appears in the list or monthly summary

### Requirement: Expense list ordering

The system SHALL sort the expense list by date descending (newest first). Expenses on the same date MAY be ordered by creation order.

#### Scenario: Newer dates appear first

- **WHEN** expenses exist with dates `2026-05-20` and `2026-05-25`
- **THEN** the expense dated `2026-05-25` appears above `2026-05-20` in the list

### Requirement: Date field defaults and constraints

The system SHALL provide a date input defaulting to today. The date MUST be in `YYYY-MM-DD` format and MUST NOT be after today.

#### Scenario: Default date is today

- **WHEN** the user opens the add-expense form
- **THEN** the date field is pre-filled with today's calendar date

#### Scenario: Reject future date

- **WHEN** the user submits a date after today
- **THEN** the system SHALL NOT save the expense and SHALL show a validation error
