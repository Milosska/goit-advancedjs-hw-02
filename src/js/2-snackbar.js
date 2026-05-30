import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import errorIcon from '../img/error.svg';
import successIcon from '../img/success.svg';

const refs = {
  form: document.querySelector('.form'),
  delayInput: document.querySelector('input[name="delay"]'),
  resultFields: document.querySelectorAll('input[name="state"]'),
  submitBtn: document.querySelector('button[type="submit"]'),
};

let delayValue = null;
let promiseResult = null;

const enableSubmitBtn = event => {
  delayValue = Number(refs.delayInput.value.trim());
  promiseResult = [...refs.resultFields].find(field => field.checked)?.value;

  if (!delayValue || !promiseResult) return;

  refs.submitBtn.disabled = false;
};

const createPromise = (delay, result) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      result === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  });

const onFormSubmit = event => {
  event.preventDefault();

  const promise = createPromise(delayValue, promiseResult);
  promise
    .then(result => {
      console.log(`✅ Fulfilled promise in ${result}ms`);
      iziToast.show({
        class: 'toast',
        backgroundColor: '#59a10d',
        messageColor: '#fff',
        iconUrl: successIcon,
        position: 'topRight',
        message: `Fulfilled promise in ${result}ms`,
      });
    })
    .catch(error => {
      iziToast.show({
        class: 'toast',
        backgroundColor: '#ef4040',
        messageColor: '#fff',
        iconUrl: errorIcon,
        position: 'topRight',
        message: `Rejected promise in ${error}ms`,
      });
    });

  refs.form.reset();
  refs.submitBtn.disabled = true;
};

refs.form.addEventListener('change', enableSubmitBtn);
refs.form.addEventListener('submit', onFormSubmit);
