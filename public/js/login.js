// const { default: swal } = require("sweetalert");

const loginHandle = async (e) => {
  e.preventDefault();

  const user_name = document.getElementById('username-login').value.trim();
  const password = document.getElementById('pw-login').value.trim();

  if (user_name && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ user_name, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert("Login attempt failed", "...you fiend!", "error");
    }
  }
};

const signupHandle = async (e) => {
  e.preventDefault();

  const user_name = document.getElementById('username-signup').value.trim();
  const email = document.getElementById('email-signup').value.trim();
  const password = document.getElementById('pw-signup').value.trim();

  if (user_name && email && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ user_name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert(response.statusText);
    }
  }
};

document
  .querySelector('#login-form')
  .addEventListener('submit', loginHandle);

document
  .querySelector('#signup-form')
  .addEventListener('submit', signupHandle);
