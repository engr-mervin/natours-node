import { login } from './login.js';
import { displayMap } from './leaflet.js';
import { error } from './error.js';
import { errorCatcher } from './alerts.js';
import { updateData, updatePassword } from './updateInfo.js';
import { proceedToCheckout } from './stripe.js';
const errorTitle = document.querySelector('.error__title') as HTMLElement;
const statusCode = Number(errorTitle?.dataset?.status);
const loginForm = document.querySelector('.form--login');

const locationsString =
  document?.getElementById('map')?.dataset.locations || '';

const locations = locationsString ? JSON.parse(locationsString) : null;

const bookTour = document?.getElementById('book-tour') as HTMLButtonElement;

if (bookTour) {
  const id = bookTour.dataset.tourId;
  bookTour.addEventListener('click', (e) => {
    e.preventDefault();

    errorCatcher(proceedToCheckout, id);
  });
}

if (loginForm) {
  const password = document.getElementById('password') as HTMLInputElement;
  const email = document.getElementById('email') as HTMLInputElement;
  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('login');
    errorCatcher(login, email.value, password.value);
  });
}

if (locations) displayMap(locations);

if (statusCode) error(statusCode);

const updateUserDataForm = document.querySelector('.form-user-data');
if (updateUserDataForm) {
  const email = document.getElementById('email') as HTMLInputElement;
  const name = document.getElementById('name') as HTMLInputElement;

  const photo = document.getElementById('photo') as HTMLInputElement;

  if (photo) {
    photo.addEventListener('change', function (e) {
      const img = document.querySelector(
        '.form__user-photo'
      ) as HTMLImageElement;
      if (!this?.files?.length) return;

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

    console.log(photo.files);

    if (photo?.files && photo.files[0]) {
      form.append('photo', photo.files[0]);
    }
    errorCatcher(updateData, form);
  });
}

const updatePasswordForm = document.querySelector('.form-user-settings');

if (updatePasswordForm) {
  const currentPassword = document.getElementById(
    'password-current'
  ) as HTMLInputElement;
  const password = document.getElementById('password') as HTMLInputElement;
  const passwordConfirm = document.getElementById(
    'password-confirm'
  ) as HTMLInputElement;

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
