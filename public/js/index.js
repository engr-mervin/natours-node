import { login } from './login.js';
import { displayMap } from './leaflet.js';
import { error } from './error.js';
import { errorCatcher, showAlert } from './alerts.js';
import { updateData, updatePassword } from './updateInfo.js';
import { proceedToCheckout } from './stripe.js';
const errorTitle = document.querySelector('.error__title');
const statusCode = Number(errorTitle?.dataset?.status);
const loginForm = document.querySelector('.form--login');
const body = document.querySelector('body');
if (body.dataset.alert) {
    showAlert('success', body.dataset.alert, 5);
}
const locationsString = document?.getElementById('map')?.dataset.locations || '';
const locations = locationsString ? JSON.parse(locationsString) : null;
const bookTour = document?.getElementById('book-tour');
if (bookTour) {
    const id = bookTour.dataset.tourId;
    bookTour.addEventListener('click', (e) => {
        e.preventDefault();
        errorCatcher(proceedToCheckout, id);
    });
}
if (loginForm) {
    const password = document.getElementById('password');
    const email = document.getElementById('email');
    loginForm?.addEventListener('submit', (event) => {
        event.preventDefault();
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
    const photo = document.getElementById('photo');
    if (photo) {
        photo.addEventListener('change', function (e) {
            const img = document.querySelector('.form__user-photo');
            if (!this?.files?.length)
                return;
            img.src = URL.createObjectURL(this.files[0]);
            img.onload = function () {
                URL.revokeObjectURL(img.src);
            };
        });
    }
    updateUserDataForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const form = new FormData();
        form.append('name', name.value);
        form.append('email', email.value);
        if (photo?.files && photo.files[0]) {
            form.append('photo', photo.files[0]);
        }
        errorCatcher(updateData, form);
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
