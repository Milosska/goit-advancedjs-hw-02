import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import errorIcon from '../img/error.svg';

let selectedDate = null;

const refs = {
  input: document.querySelector('#datetime-picker'),
  button: document.querySelector('button[data-start]'),
  timer: document.querySelector('.timer'),
};

const handleDisabled = elem => {
  elem.disabled = true;
};

const handleEnabled = elem => {
  elem.disabled = false;
};

const addLeadingZero = value => String(value).padStart(2, '0');

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const drowTimerUI = timerParams => {
  Object.entries(timerParams).forEach(([key, value]) => {
    const finalValue = addLeadingZero(value);

    const elem = [...refs.timer.children].find(
      child => key in child.firstElementChild.dataset
    );

    if (elem && elem.firstElementChild.textContent !== finalValue) {
      elem.firstElementChild.textContent = finalValue;
    }
  });
};

const startTimer = () => {
  if (!selectedDate) return;

  handleDisabled(refs.button);
  handleDisabled(refs.input);

  const timerId = setInterval(() => {
    const currentTime = new Date();
    const timeDifference = selectedDate - currentTime;

    if (timeDifference <= 0) {
      clearInterval(timerId);
      handleEnabled(refs.input);
      console.log('Timer finished!');
      return;
    }

    const convertedValues = convertMs(timeDifference);
    drowTimerUI(convertedValues);
  }, 1000);
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = new Date(selectedDates[0]);
    const currentDate = new Date();

    // Stop and re-drow timer in case if the date is re-picked
    if (pickedDate <= currentDate) {
      handleDisabled(refs.button);
      iziToast.show({
        class: 'warning-toast',
        backgroundColor: '#ef4040',
        messageColor: '#fff',
        iconUrl: errorIcon,
        position: 'topRight',
        message: 'Please choose a date in the future',
      });
      return;
    }

    selectedDate = pickedDate;
    handleEnabled(refs.button);
  },
};

const fp = flatpickr('#datetime-picker', options);
refs.button.addEventListener('click', startTimer);
