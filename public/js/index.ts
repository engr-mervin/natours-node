import { login } from './login.js';
import { displayMap } from './leaflet.js';

const form = document.querySelector('.form');
const email = document.getElementById('email') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;

const locationsString =
  document?.getElementById('map')?.dataset.locations || '';

const locations = locationsString ? JSON.parse(locationsString) : null;

if (form) {
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    login(email.value, password.value);
  });
}

if (locations) displayMap(locations);
