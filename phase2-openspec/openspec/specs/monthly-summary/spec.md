# monthly-summary Specification

## Purpose
TBD - created by archiving change expense-tracker-app. Update Purpose after archive.
## Requirements
### Requirement: User can open monthly summary view

The system SHALL provide a dedicated monthly summary view separate from the main expense list.

#### Scenario: Navigate to summary

- **WHEN** the user selects the monthly summary navigation option
- **THEN** the summary view is displayed

### Requirement: User can select a calendar month

The system SHALL allow the user to choose a year and month to summarize.

#### Scenario: Default month is current month

- **WHEN** the user opens the monthly summary view
- **THEN** the selected month defaults to the current calendar month

#### Scenario: Change selected month

- **WHEN** the user changes the month or year selector
- **THEN** the summary updates to reflect expenses in that calendar month

### Requirement: Monthly total is calculated

The system SHALL compute and display the total amount of all expenses whose `date` falls within the selected calendar month (inclusive of first through last day).

#### Scenario: Total for month with expenses

- **WHEN** expenses exist with dates `2026-05-01` and `2026-05-31` and the user selects May 2026
- **THEN** the displayed total equals the sum of those expense amounts

#### Scenario: Total for month with no expenses

- **WHEN** no expenses exist in the selected month
- **THEN** the displayed total is `0.00` (or equivalent zero formatting)

#### Scenario: Expenses outside month are excluded

- **WHEN** an expense has date `2026-04-30` and the user selects May 2026
- **THEN** that expense is not included in the total or breakdown

### Requirement: Monthly breakdown lists expenses

The system SHALL list each expense in the selected month showing date, description, and amount, sorted by date ascending unless otherwise specified.

#### Scenario: Breakdown matches filtered expenses

- **WHEN** three expenses exist in May 2026 and the user selects May 2026
- **THEN** the breakdown table lists exactly those three expenses

#### Scenario: Empty month breakdown

- **WHEN** no expenses exist in the selected month
- **THEN** the system SHALL show a message indicating no expenses for that month

### Requirement: Summary stays consistent with storage

The monthly summary SHALL reflect the current contents of local storage after any add, edit, or delete on the expense list.

#### Scenario: Summary updates after delete

- **WHEN** the user deletes an expense from May 2026 and views May 2026 summary
- **THEN** the deleted expense does not appear and the total is recalculated

