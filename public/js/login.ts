import { showAlert } from './alerts.js';
export const login = async function (email: string, password: string) {
  try {
    const body = JSON.stringify({
      email: email || '',
      password: password || '',
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

    showAlert('success', 'Logged in successfully');

    setTimeout(() => {
      window.location.href = 'http://localhost:3000/';
    }, 1500);
    //   document.cookie = `token=${loginResult.token}; path=/;`;
  } catch (error: any) {
    showAlert('error', error!.message!);
  }
};
