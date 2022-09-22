const { default: swal } = require("sweetalert");

const loginHandle = async (e) => {
  e.preventDefault();

  const username = document.getElementById('username-login').value.trim();
  const password = document.getElementById('pw-login').value.trim();

  if (username && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      swal("Login attempt failed", "...you fiend!", "error");
    }
  }
};

const signupHandle = async (e) => {
  e.preventDefault();

  const username = document.getElementById('username-signup').value.trim();
  const email = document.getElementById('email-signup').value.trim();
  const password = document.getElementById('pw-signup').value.trim();

  if (username && email && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      swal(response.statusText);
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginHandle);

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupHandle);
