let isLogin = true;

// Handle form submission (either login or signup)
document.getElementById('authForm').onsubmit = async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Set endpoint based on login or signup mode
  const endpoint = isLogin ? '/auth/login' : '/auth/signup';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (res.ok) {
    const responseText = await res.text();  // Use `.text()` instead of `.json()`
    alert(responseText);  // Alert the response message (login successful or error)

    // Redirect based on the mode (login or signup)
    if (isLogin) {
      window.location.href = 'dashboard.html'; // Redirect to the dashboard on login
    } else {
      // After signup, toggle to login mode and redirect to login page
      toggleMode(); // Switch to login mode
    }
  } else {
    const errorMessage = await res.text();
    alert(`Error: ${errorMessage}`);
  }
};

// Toggle between login and signup mode
function toggleMode() {
  isLogin = !isLogin;
  
  const submitButton = document.querySelector('#authForm button[type="submit"]');
  const toggleText = document.querySelector('.switch-mode-text');

  // Change the button text based on the mode
  submitButton.textContent = isLogin ? 'Login' : 'Sign Up';
  toggleText.textContent = isLogin 
    ? "Don't have an account? Sign up" 
    : "Already have an account? Log in";

  // Clear input fields when switching forms
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
}
