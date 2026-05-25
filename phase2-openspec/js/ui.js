export function formatCurrency(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n);
}

export function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (input) input.classList.add('form__input--error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }
}

export function clearFormErrors() {
  ['amount', 'description', 'date'].forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    if (input) input.classList.remove('form__input--error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  });
}

export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
