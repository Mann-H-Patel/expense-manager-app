const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const expensesRoutes = require('./routes/expenses');

const app = express();

// Use express-session for session management
app.use(session({
  secret: 'your_secret_key', 
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,  // Set this to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24,  // 1-day session expiration
    sameSite: 'Lax',  // Prevents issues with cross-site cookies
  },
}));


app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from the public directory

app.use('/auth', authRoutes);       // Mount authentication routes
app.use('/expenses', expensesRoutes); // Mount expenses routes

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
