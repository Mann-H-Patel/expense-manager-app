const express = require('express');
const db = require('../db');
const router = express.Router();

// Middleware to check if the user is logged in

const checkLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

router.post('/add', checkLogin, (req, res) => {
  const userId = req.session.userId;  // Get user ID from session
  // console.log('User ID in session for adding expense:', userId);  // Debugging line

  const { description, amount } = req.body;
  const date = new Date().toISOString();

  db.run(`INSERT INTO expenses (user_id, description, amount, date) VALUES (?, ?, ?, ?)`,
    [userId, description, amount, date],
    function (err) {
      if (err) return res.status(500).send('Failed to add expense');
      res.send('Expense added successfully');
    });
});

router.delete('/delete-expense/:id', checkLogin, (req, res) => {
  const expenseId = req.params.id;
  const deleteQuery = 'DELETE FROM expenses WHERE id = ?';

  db.run(deleteQuery, [expenseId], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Failed to delete expense' });
    } else {
      res.json({ success: true, message: 'Expense deleted successfully' });
    }
  });
});

// Route to get all expenses for the logged-in user
router.get('/all', checkLogin, (req, res) => {
  const userId = req.session.userId;  // Get the user ID from the session

  db.all(`SELECT * FROM expenses WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).send('Failed to fetch expenses');
    res.json(rows);  // Return expenses for the logged-in user
  });
});


module.exports = router;
