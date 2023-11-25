const form = document.querySelector('.form');
const email = document.getElementById('email') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;

form?.addEventListener('submit', async function (event) {
  event.preventDefault();
  const body = JSON.stringify({
    email: email?.value || '',
    password: password?.value || '',
  });
  console.log(body);
  const loginRequest = await fetch('http://localhost:3000/api/v1/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const loginResult = await loginRequest.json();

  //   document.cookie = `token=${loginResult.token}; path=/;`;

  console.log(loginResult);
});
