import { login } from './login.js';
import { displayMap } from './leaflet.js';
import { error } from './error.js';
import { errorCatcher } from './alerts.js';
import { updateData, updatePassword } from './updateInfo.js';
const errorTitle = document.querySelector('.error__title');
const statusCode = Number(errorTitle?.dataset?.status);
const loginForm = document.querySelector('.form--login');
const locationsString = document?.getElementById('map')?.dataset.locations || '';
const locations = locationsString ? JSON.parse(locationsString) : null;
if (loginForm) {
    const password = document.getElementById('password');
    const email = document.getElementById('email');
    loginForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('login');
        errorCatcher(login, email.value, password.value);
    });
}
if (locations)
    displayMap(locations);
if (statusCode)
    error(statusCode);
const updateUserDataForm = document.querySelector('.form-user-data');
if (updateUserDataForm) {
    const email = document.getElementById('email');
    const name = document.getElementById('name');
    updateUserDataForm.addEventListener('submit', (event) => {
        event.preventDefault();
        errorCatcher(updateData, {
            name: name?.value || '',
            email: email?.value || '',
        });
    });
}
const updatePasswordForm = document.querySelector('.form-user-settings');
if (updatePasswordForm) {
    const currentPassword = document.getElementById('password-current');
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('password-confirm');
    updatePasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        await errorCatcher(updatePassword, {
            currentPassword: currentPassword?.value || '',
            password: password?.value || '',
            passwordConfirm: passwordConfirm?.value || '',
        });
        currentPassword.value = '';
        password.value = '';
        passwordConfirm.value = '';
    });
}
