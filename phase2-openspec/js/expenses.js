import * as storage from './storage.js';
import { todayISO } from './ui.js';

export function generateId() {
  return crypto.randomUUID();
}

export function validateFields({ amount, description, date }) {
  const errors = {};

  const amountStr = String(amount ?? '').trim();
  if (!amountStr) {
    errors.amount = 'Amount is required.';
  } else {
    const num = Number(amountStr);
    if (!Number.isFinite(num) || num <= 0) {
      errors.amount = 'Amount must be a positive number.';
    } else if (!/^\d+(\.\d{1,2})?$/.test(amountStr)) {
      errors.amount = 'Amount may have at most 2 decimal places.';
    }
  }

  const desc = String(description ?? '').trim();
  if (!desc) {
    errors.description = 'Description is required.';
  } else if (desc.length > 200) {
    errors.description = 'Description must be 200 characters or fewer.';
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = 'Date must be valid (YYYY-MM-DD).';
  } else if (date > todayISO()) {
    errors.date = 'Date cannot be in the future.';
  }

  return errors;
}

export function sortByDateDesc(list) {
  return [...list].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return b.id.localeCompare(a.id);
  });
}

export function getAll() {
  return sortByDateDesc(storage.getAll());
}

export function add({ amount, description, date }) {
  const errors = validateFields({ amount, description, date });
  if (Object.keys(errors).length) return { ok: false, errors };

  const expense = {
    id: generateId(),
    amount: Math.round(Number(amount) * 100) / 100,
    description: String(description).trim(),
    date,
  };
  const next = [...storage.getAll(), expense];
  storage.save(next);
  return { ok: true, expense };
}

export function update(id, { amount, description, date }) {
  const errors = validateFields({ amount, description, date });
  if (Object.keys(errors).length) return { ok: false, errors };

  const all = storage.getAll();
  const idx = all.findIndex((e) => e.id === id);
  if (idx === -1) return { ok: false, errors: { _form: 'Expense not found.' } };

  const updated = {
    id,
    amount: Math.round(Number(amount) * 100) / 100,
    description: String(description).trim(),
    date,
  };
  const next = [...all];
  next[idx] = updated;
  storage.save(next);
  return { ok: true, expense: updated };
}

export function remove(id) {
  const next = storage.getAll().filter((e) => e.id !== id);
  storage.save(next);
  return { ok: true };
}

export function getById(id) {
  return storage.getAll().find((e) => e.id === id) ?? null;
}
