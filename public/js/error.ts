import { showAlert } from './alerts';

export const error = function (statusCode: number) {
  if (statusCode === 401) {
    showAlert('error', 'Redirecting to login page...');
    setTimeout(() => {
      window.location.href = `${window.location.origin}/login`;
    }, 3000);
  }
};
