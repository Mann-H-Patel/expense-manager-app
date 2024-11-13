document.getElementById('expenseForm').onsubmit = async (e) => {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;

  const res = await fetch('/expenses/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, amount }),
  });

  if (res.ok) {
    alert('Expense added successfully');
    loadExpenses(); // Reload the expenses list after successful addition
  } else {
    alert('Failed to add expense');
  }
};

// Function to load expenses from the server
async function loadExpenses() {
  try {
    const res = await fetch('/expenses/all', {
      credentials: 'same-origin',
    });

    if (!res.ok) {
      const errorMessage = await res.text();
      alert(`Failed to load expenses: ${errorMessage}`);
      return;
    }

    const expenses = await res.json();
    const table = document.getElementById('expensesTable');
    table.innerHTML = `
      <tr>
        <th>Description</th>
        <th>Amount</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    `;

    if (expenses.length === 0) {
      const row = table.insertRow();
      row.insertCell(0).textContent = 'No expenses found';
      row.colSpan = 4;
      return;
    }

    expenses.forEach(exp => {
      const row = table.insertRow();
      row.insertCell(0).textContent = exp.description;
      row.insertCell(1).textContent = `₹${exp.amount}`;
      row.insertCell(2).textContent = new Date(exp.date).toLocaleDateString();
      row.insertCell(3).innerHTML = `
        <button class="delete-btn" onclick="deleteExpense(${exp.id})">
          <i class="fas fa-trash-alt"></i> Delete
        </button>
      `;
    });
  } catch (error) {
    alert(`Error loading expenses: ${error.message}`);
  }
}

// JavaScript to handle expense deletion
async function deleteExpense(expenseId) {
  if (confirm("Are you sure you want to delete this expense?")) {
    const res = await fetch(`/expenses/delete-expense/${expenseId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert("Expense deleted successfully");
      loadExpenses();  // Reload expenses to reflect deletion
    } else {
      alert("Failed to delete expense");
    }
  }
}

// Load expenses when the page loads
loadExpenses();


document.getElementById('expenseForm').onsubmit = async (e) => {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;

  // Send expense data to the server
  const res = await fetch('/expenses/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, amount }),
    credentials: 'same-origin',  // Ensure the session cookie is sent with the request
  });

  if (res.ok) {
    alert('Expense added successfully');
    loadExpenses();  // Reload the expenses list after successful addition
  } else {
    alert('Failed to add expense');
  }
};


document.getElementById('logoutButton').onclick = async () => {
  const res = await fetch('/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.ok) {
    alert('Logged out successfully');
    window.location.href = 'index.html';  // Redirect to the login page after logout
  } else {
    alert('Failed to log out');
  }
};



