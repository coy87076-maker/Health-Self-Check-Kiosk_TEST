// ── Apps Script ───────────────────────
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0xvumxPNPQQLfHApymUYc3IrH1Mi3-5psKYBQdPxXxRCxhH2YQWikr9lGKIWnjg78/exec';

// ── BMI category data ─────────────────────────────────────────────────────
const COLORS = {
  Underweight: '#2196a8',
  Normal:      '#2e7d32',
  Overweight:  '#e07b00',
  Obese:       '#c62828'
};

const MESSAGES = {
  Underweight: 'Consider a balanced, calorie-sufficient diet.',
  Normal:      'Great! Keep up your healthy habits.',
  Overweight:  'Consider more physical activity and mindful eating.',
  Obese:       'We recommend consulting a healthcare provider.'
};

// Maps BMI 10–40 to 0–100% position on the meter track
function bmiToPercent(bmi) {
  return Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100));
}

// ── Form submit ───────────────────────────────────────────────────────────
document.getElementById('bmiForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name     = document.getElementById('name').value.trim();
  const age      = parseInt(document.getElementById('age').value);
  const sex      = document.getElementById('sex').value;
  const weight   = parseFloat(document.getElementById('weight').value);
  const heightCm = parseFloat(document.getElementById('height').value);

  if (!name || !sex || isNaN(age) || isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
    showStatus('Please fill out all fields with valid values.', 'error');
    return;
  }

  const heightM = heightCm / 100;
  const bmi = +(weight / (heightM * heightM)).toFixed(1);

  let category;
  if      (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25)   category = 'Normal';
  else if (bmi < 30)   category = 'Overweight';
  else                 category = 'Obese';

  showResult({ name, age, sex, weight, heightCm, bmi, category });
  syncToSheet({ name, age, sex, weight, heightCm, bmi, category });
});

// ── Show result card ──────────────────────────────────────────────────────
function showResult({ name, age, sex, weight, heightCm, bmi, category }) {
  const color = COLORS[category];

  document.getElementById('resultBanner').style.background = color;
  document.getElementById('resultName').textContent        = name + ' — ' + category;
  document.getElementById('resultMessage').textContent     = MESSAGES[category];
  document.getElementById('bmiVal').textContent            = bmi;
  document.getElementById('detAge').textContent            = age + ' yrs';
  document.getElementById('detSex').textContent            = sex;
  document.getElementById('detWeight').textContent         = weight + ' kg';
  document.getElementById('detHeight').textContent         = heightCm + ' cm';
  document.getElementById('detCat').textContent            = category;
  document.getElementById('detCat').style.color            = color;

  // Animate needle after a short delay so transition fires
  setTimeout(function() {
    document.getElementById('meterNeedle').style.left = bmiToPercent(bmi) + '%';
  }, 100);

  const card = document.getElementById('resultCard');
  card.classList.add('visible');
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Sync to Google Sheet via FormData POST ────────────────────────────────
// Uses the same pattern as the working form example:
// new FormData(form) — no Content-Type header, no CORS preflight, always reaches the sheet.
function syncToSheet(data) {
  const form = document.getElementById('sheetForm');
  form.name.value     = data.name;
  form.age.value      = data.age;
  form.sex.value      = data.sex;
  form.weight.value   = data.weight;
  form.heightCm.value = data.heightCm;
  form.bmi.value      = data.bmi;
  form.category.value = data.category;

  showStatus('Saving to Google Sheet…', 'info');

  fetch(SCRIPT_URL, { method: 'POST', body: new FormData(form) })
    .then(function(r) { return r.text(); })
    .then(function()  { showStatus('Result saved to Google Sheet.', 'success'); })
    .catch(function() { showStatus('Saved locally but sheet sync failed. Check your network.', 'error'); });
}

// ── Status bar ────────────────────────────────────────────────────────────
function showStatus(msg, type) {
  const el = document.getElementById('statusMsg');
  el.textContent = msg;
  el.className = 'status-msg ' + type;
  clearTimeout(el._t);
  el._t = setTimeout(function() { el.className = 'status-msg'; }, 5000);
}