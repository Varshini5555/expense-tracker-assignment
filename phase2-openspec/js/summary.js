import * as expenses from './expenses.js';
import { formatCurrency, escapeHtml } from './ui.js';

export function filterByMonth(year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return expenses
    .getAll()
    .filter((e) => e.date.startsWith(prefix))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function computeTotal(items) {
  const sum = items.reduce((acc, e) => acc + e.amount, 0);
  return Math.round(sum * 100) / 100;
}

export function populateYearMonthSelectors(yearSelect, monthSelect) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const all = expenses.getAll();
  const years = new Set([currentYear]);
  all.forEach((e) => years.add(parseInt(e.date.slice(0, 4), 10)));
  const sortedYears = [...years].sort((a, b) => b - a);

  yearSelect.innerHTML = sortedYears
    .map((y) => `<option value="${y}">${y}</option>`)
    .join('');
  yearSelect.value = String(currentYear);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  monthSelect.innerHTML = months
    .map((name, i) => {
      const m = i + 1;
      return `<option value="${m}">${name}</option>`;
    })
    .join('');
  monthSelect.value = String(currentMonth);
}

export function renderSummary(yearSelect, monthSelect, totalEl, emptyEl, tableEl, tbodyEl) {
  const year = parseInt(yearSelect.value, 10);
  const month = parseInt(monthSelect.value, 10);
  const items = filterByMonth(year, month);
  const total = computeTotal(items);

  totalEl.textContent = formatCurrency(total);

  if (items.length === 0) {
    emptyEl.hidden = false;
    tableEl.hidden = true;
    tbodyEl.innerHTML = '';
    return;
  }

  emptyEl.hidden = true;
  tableEl.hidden = false;
  tbodyEl.innerHTML = items
    .map(
      (e) => `
      <tr>
        <td>${escapeHtml(e.date)}</td>
        <td>${escapeHtml(e.description)}</td>
        <td>${escapeHtml(formatCurrency(e.amount))}</td>
      </tr>`
    )
    .join('');
}
