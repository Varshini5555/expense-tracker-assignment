import * as storage from './storage.js';
import * as expenses from './expenses.js';
import * as summary from './summary.js';
import {
  formatCurrency,
  todayISO,
  showFieldError,
  clearFormErrors,
  escapeHtml,
} from './ui.js';

let editingId = null;

const form = document.getElementById('expense-form');
const formTitle = document.getElementById('form-title');
const expenseIdInput = document.getElementById('expense-id');
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const expenseList = document.getElementById('expense-list');
const expenseListEmpty = document.getElementById('expense-list-empty');

const viewExpenses = document.getElementById('view-expenses');
const viewSummary = document.getElementById('view-summary');
const navExpenses = document.getElementById('nav-expenses');
const navSummary = document.getElementById('nav-summary');

const summaryYear = document.getElementById('summary-year');
const summaryMonth = document.getElementById('summary-month');
const summaryTotal = document.getElementById('summary-total');
const summaryEmpty = document.getElementById('summary-empty');
const summaryTable = document.getElementById('summary-table');
const summaryTbody = document.getElementById('summary-tbody');

function setMaxDate() {
  dateInput.max = todayISO();
}

function resetForm() {
  editingId = null;
  expenseIdInput.value = '';
  form.reset();
  dateInput.value = todayISO();
  setMaxDate();
  formTitle.textContent = 'Add expense';
  submitBtn.textContent = 'Add expense';
  cancelEditBtn.hidden = true;
  clearFormErrors();
}

function showValidationErrors(errors) {
  clearFormErrors();
  if (errors.amount) showFieldError('amount', errors.amount);
  if (errors.description) showFieldError('description', errors.description);
  if (errors.date) showFieldError('date', errors.date);
}

function renderExpenseList() {
  const list = expenses.getAll();
  if (list.length === 0) {
    expenseList.hidden = true;
    expenseListEmpty.hidden = false;
    expenseList.innerHTML = '';
    return;
  }

  expenseList.hidden = false;
  expenseListEmpty.hidden = true;
  expenseList.innerHTML = list
    .map(
      (e) => `
    <li class="expense-item" data-id="${escapeHtml(e.id)}">
      <div class="expense-item__main">
        <p class="expense-item__desc">${escapeHtml(e.description)}</p>
        <p class="expense-item__meta">${escapeHtml(e.date)}</p>
      </div>
      <span class="expense-item__amount">${escapeHtml(formatCurrency(e.amount))}</span>
      <div class="expense-item__actions">
        <button type="button" class="btn btn--ghost" data-action="edit" data-id="${escapeHtml(e.id)}">Edit</button>
        <button type="button" class="btn btn--danger" data-action="delete" data-id="${escapeHtml(e.id)}">Delete</button>
      </div>
    </li>`
    )
    .join('');
}

function refreshSummary() {
  summary.renderSummary(
    summaryYear,
    summaryMonth,
    summaryTotal,
    summaryEmpty,
    summaryTable,
    summaryTbody
  );
}

function refreshAll() {
  renderExpenseList();
  refreshSummary();
}

function showView(name) {
  const isExpenses = name === 'expenses';
  viewExpenses.hidden = !isExpenses;
  viewExpenses.classList.toggle('view--active', isExpenses);
  viewSummary.hidden = isExpenses;
  navExpenses.classList.toggle('nav__btn--active', isExpenses);
  navSummary.classList.toggle('nav__btn--active', !isExpenses);
  if (!isExpenses) refreshSummary();
}

function startEdit(id) {
  const expense = expenses.getById(id);
  if (!expense) return;
  editingId = id;
  expenseIdInput.value = id;
  amountInput.value = String(expense.amount);
  descriptionInput.value = expense.description;
  dateInput.value = expense.date;
  formTitle.textContent = 'Edit expense';
  submitBtn.textContent = 'Save changes';
  cancelEditBtn.hidden = false;
  clearFormErrors();
  viewExpenses.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function bindNavigation() {
  navExpenses.addEventListener('click', () => showView('expenses'));
  navSummary.addEventListener('click', () => showView('summary'));
}

function bindForm() {
  setMaxDate();
  dateInput.value = todayISO();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = {
      amount: amountInput.value,
      description: descriptionInput.value,
      date: dateInput.value,
    };

    const result = editingId
      ? expenses.update(editingId, payload)
      : expenses.add(payload);

    if (!result.ok) {
      showValidationErrors(result.errors);
      return;
    }

    resetForm();
    refreshAll();
  });

  cancelEditBtn.addEventListener('click', () => resetForm());
}

function bindExpenseList() {
  expenseList.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'edit') {
      startEdit(id);
      return;
    }

    if (action === 'delete') {
      const expense = expenses.getById(id);
      if (!expense) return;
      const msg = `Delete "${expense.description}" (${formatCurrency(expense.amount)})?`;
      if (confirm(msg)) {
        expenses.remove(id);
        if (editingId === id) resetForm();
        refreshAll();
      }
    }
  });
}

function bindSummary() {
  summaryYear.addEventListener('change', () =>
    summary.renderSummary(
      summaryYear,
      summaryMonth,
      summaryTotal,
      summaryEmpty,
      summaryTable,
      summaryTbody
    )
  );
  summaryMonth.addEventListener('change', () =>
    summary.renderSummary(
      summaryYear,
      summaryMonth,
      summaryTotal,
      summaryEmpty,
      summaryTable,
      summaryTbody
    )
  );
}

function init() {
  storage.load();
  bindNavigation();
  bindForm();
  bindExpenseList();
  bindSummary();
  summary.populateYearMonthSelectors(summaryYear, summaryMonth);
  storage.onExternalChange(refreshAll);
  resetForm();
  refreshAll();
  showView('expenses');
}

init();
