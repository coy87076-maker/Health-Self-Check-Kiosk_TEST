const scriptURL = 'https://script.google.com/macros/s/AKfycbz0xvumxPNPQQLfHApymUYc3IrH1Mi3-5psKYBQdPxXxRCxhH2YQWikr9lGKIWnjg78/exec';

document.getElementById('bmiForm').addEventListener('submit', function(e) {
 e.preventDefault();
 const name = document.getElementById('name').value.trim();

 const weight = parseFloat(document.getElementById('weight').value);
 const heightCm = parseFloat(document.getElementById('height').value);
 // if-else: validation
 if (!name || isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
 alert('Please fill out all fields with valid values.');
 return;
 }
 const heightM = heightCm / 100;
 const bmi = +(weight / (heightM * heightM)).toFixed(1);
 let category, message, color;
 // switch-case: classify BMI
 switch (true) {
 case bmi < 18.5:
 category = 'Underweight'; color = '#5DADE2';
 message = 'Consider a balanced, calorie-sufficient diet.';
 break;
 case bmi < 25:
 category = 'Normal'; color = '#58D68D';
 message = 'Great! Keep up your healthy habits.';
 break;
 case bmi < 30:
 category = 'Overweight'; color = '#F5B041';
 message = 'Consider more physical activity and mindful eating.';
 break;
 default:
 category = 'Obese'; color = '#EC7063';
 message = 'We recommend consulting a healthcare provider.';
 }
 showResult(name, bmi, category, message, color);
 recordSubmission({ name, weight, heightCm, bmi, category });
});