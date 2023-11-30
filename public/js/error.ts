import { showAlert } from './alerts';

export const error = function (statusCode: number) {
  if (statusCode === 401) {
    console.log('Unauthorized.');
    showAlert('error', 'Redirecting to login page...');
    setTimeout(() => {
      window.location.href = '/login';
    }, 3000);
  }
};
