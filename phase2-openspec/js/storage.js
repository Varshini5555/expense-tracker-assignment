const STORAGE_KEY = 'expense-tracker:v1';

/** @typedef {{ id: string, amount: number, description: string, date: string }} Expense */

let expenses = [];

function isValidExpense(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const { id, amount, description, date } = obj;
  if (typeof id !== 'string' || !id) return false;
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) return false;
  if (typeof description !== 'string' || !description.trim()) return false;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  return true;
}

function parseStored(raw) {
  if (!raw) return [];
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    console.warn('[expense-tracker] Invalid JSON in localStorage; resetting.');
    return [];
  }
  if (!data || typeof data !== 'object' || data.version !== 1 || !Array.isArray(data.expenses)) {
    console.warn('[expense-tracker] Invalid document shape; resetting.');
    return [];
  }
  const valid = data.expenses.filter(isValidExpense);
  if (valid.length !== data.expenses.length) {
    console.warn('[expense-tracker] Skipped invalid expense entries on load.');
  }
  return valid;
}

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    expenses = parseStored(raw);
  } catch (err) {
    console.warn('[expense-tracker] Failed to read localStorage:', err);
    expenses = [];
  }
  return [...expenses];
}

export function getAll() {
  return [...expenses];
}

export function save(nextExpenses) {
  expenses = nextExpenses.map((e) => ({ ...e }));
  const doc = { version: 1, expenses };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
}

export function onExternalChange(callback) {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      load();
      callback();
    }
  });
}
