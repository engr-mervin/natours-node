import { showAlert } from './alerts';
export const error = function (statusCode) {
    if (statusCode === 401) {
        showAlert('error', 'Redirecting to login page...');
        setTimeout(() => {
            window.location.href = '/login';
        }, 3000);
    }
};
