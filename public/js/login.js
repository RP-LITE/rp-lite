const { default: swal } = require("sweetalert");

const loginHandle = async (e) => {
  e.preventDefault();

  const email = document.getElementById('email-login').value.trim();
  const password = document.getElementById('password-login').value.trim();

  if (email && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      swal("Login attempt failed", "...you fiend!", "error");
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginHandle);
