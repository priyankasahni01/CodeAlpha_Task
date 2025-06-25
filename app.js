// Elements
const form = document.getElementById('ageForm');
const daySelect = document.getElementById('day');
const monthSelect = document.getElementById('month');
const yearSelect = document.getElementById('year');

const yearsEl = document.getElementById('years');
const monthsEl = document.getElementById('months');
const daysEl = document.getElementById('days');
const resultBox = document.getElementById('result');
const birthdayEl = document.getElementById('birthdayMsg');

// Fill Day, Month, Year dropdowns
function populateDateFields() {
  for (let d = 1; d <= 31; d++) {
    daySelect.innerHTML += `<option value="${d}">${d}</option>`;
  }
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  months.forEach((month, index) => {
    monthSelect.innerHTML += `<option value="${index}">${month}</option>`;
  });
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1900; y--) {
    yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
  }
}

// Age calculation
function calculateAge(dob) {
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthDays;
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days };
}

// On form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const day = parseInt(daySelect.value);
  const month = parseInt(monthSelect.value);
  const year = parseInt(yearSelect.value);

  if (!day || isNaN(month) || !year) {
    alert('Please select valid Day, Month, and Year.');
    return;
  }

  const dob = new Date(year, month, day);
  const today = new Date();

  if (dob > today) {
    alert('Date of birth cannot be in the future.');
    return;
  }

  const { years, months, days } = calculateAge(dob);

  yearsEl.textContent = years;
  monthsEl.textContent = months;
  daysEl.textContent = days;
  resultBox.classList.remove('hidden');

  // 🎂 Check for Birthday
  if (today.getDate() === dob.getDate() && today.getMonth() === dob.getMonth()) {
    birthdayEl.textContent = '🎉 Happy Birthday! 🎂';
  } else {
    birthdayEl.textContent = '';
  }
});

// Initialize dropdowns on page load
populateDateFields();
