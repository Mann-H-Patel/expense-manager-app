// Array to map month numbers to month names
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Fetch unique month-year combinations and create buttons
document.addEventListener('DOMContentLoaded', () => {
  fetch(`/expenses/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    const uniqueMonths = getUniqueMonths(data);
    createMonthButtons(uniqueMonths);
  })
  .catch(error => console.error('Error fetching expenses data:', error));
});

// Function to extract unique month-year combinations from expenses data
function getUniqueMonths(data) {
  const monthSet = new Set();
  data.forEach(expense => {
    const date = new Date(expense.date);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;  // Format: MM-YYYY
    monthSet.add(monthYear);
  });
  return Array.from(monthSet).sort((a, b) => new Date(`01-${a}`) - new Date(`01-${b}`));
}

// Create buttons for each unique month-year
function createMonthButtons(uniqueMonths) {
  const monthButtonsContainer = document.getElementById('month-buttons');
  uniqueMonths.forEach(monthYear => {
    const [month, year] = monthYear.split('-');
    const button = document.createElement('button');
    button.textContent = `${months[parseInt(month) - 1]} ${year}`;
    button.addEventListener('click', () => fetchMonthlyData(parseInt(month), parseInt(year)));
    monthButtonsContainer.appendChild(button);
  });
}

// Fetch expenses for a specific month and year
function fetchMonthlyData(month, year) {
  fetch(`/expenses/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    const filteredData = data.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() + 1 === month && expenseDate.getFullYear() === year;
    });
    displayMonthlyData(filteredData, month, year);
  })
  .catch(error => console.error('Error fetching monthly data:', error));
}

// Display expenses data in a table format
function displayMonthlyData(data, month, year) {
  const expensesTableContainer = document.getElementById('expenses-table');
  expensesTableContainer.innerHTML = '';  // Clear previous table

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  ['Date', 'Description', 'Amount'].forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  data.forEach(expense => {
    const row = document.createElement('tr');
    const dateCell = document.createElement('td');
    dateCell.textContent = new Date(expense.date).toLocaleDateString();
    const descCell = document.createElement('td');
    descCell.textContent = expense.description;
    const amountCell = document.createElement('td');
    amountCell.textContent = `₹${expense.amount.toFixed(2)}`;
    row.appendChild(dateCell);
    row.appendChild(descCell);
    row.appendChild(amountCell);
    table.appendChild(row);
  });

  const monthTitle = document.createElement('h2');
  monthTitle.textContent = `${months[month - 1]} ${year}`;
  expensesTableContainer.appendChild(monthTitle);
  expensesTableContainer.appendChild(table);
}
