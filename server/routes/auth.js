const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Sign up route
router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function (err) {
    if (err) return res.status(400).send('User already exists');
    res.send('Signup successful');
  });
});

// Login route
// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send('Invalid credentials');
    }

    req.session.userId = user.id;  // Store user ID in session
    // console.log('Session after login:', req.session);  // Debugging line to check session
    res.send({ message: 'Login successful' });  // Send a success message after login
  });
});




// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.send('Logged out successfully');
  });
});

module.exports = router;
