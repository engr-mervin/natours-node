'use strict';
const form = document.querySelector('.form');
const email = document.getElementById('email');
const password = document.getElementById('password');
form?.addEventListener('submit', async function (event) {
  try {
    event.preventDefault();
    const body = JSON.stringify({
      email: email?.value || '',
      password: password?.value || '',
    });
    const loginRequest = await fetch(
      'http://localhost:3000/api/v1/users/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }
    );
    const loginResult = await loginRequest.json();
    if (loginResult.error) {
      throw loginResult;
    }

    alert('Logged in successfully');
    setTimeout(() => {
      window.location.href = 'http://localhost:3000/';
    }, 1500);
    //   document.cookie = `token=${loginResult.token}; path=/;`;
  } catch (error) {
    alert(error.message);
  }
});
