const form = document.getElementById("expense-form");
const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const formError = document.getElementById("form-error");
const expenseList = document.getElementById("expense-list");
const expenseCount = document.getElementById("expense-count");
const totalAmount = document.getElementById("total-amount");
const emptyState = document.getElementById("empty-state");

const expenses = [];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function showError(message) {
  formError.textContent = message;
  formError.hidden = !message;
}

function updateUI() {
  expenseList.innerHTML = "";

  expenses.forEach((expense, index) => {
    const li = document.createElement("li");
    li.className = "expense-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "expense-name";
    nameSpan.textContent = expense.name;

    const amountSpan = document.createElement("span");
    amountSpan.className = "expense-amount";
    amountSpan.textContent = formatCurrency(expense.amount);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn-remove";
    removeBtn.setAttribute("aria-label", `Remove ${expense.name}`);
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => {
      expenses.splice(index, 1);
      updateUI();
    });

    const rightGroup = document.createElement("div");
    rightGroup.style.display = "flex";
    rightGroup.style.alignItems = "center";
    rightGroup.append(amountSpan, removeBtn);

    li.append(nameSpan, rightGroup);
    expenseList.appendChild(li);
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  expenseCount.textContent = String(expenses.length);
  totalAmount.textContent = formatCurrency(total);
  emptyState.hidden = expenses.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  showError("");

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!name) {
    showError("Please enter a name for the expense.");
    nameInput.focus();
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    showError("Please enter an amount greater than zero.");
    amountInput.focus();
    return;
  }

  expenses.push({ name, amount: Math.round(amount * 100) / 100 });
  updateUI();

  form.reset();
  nameInput.focus();
});

updateUI();
