let spinning = false;
let angle = 0;
const prizes = [
  { name: 'Anti-Mage', color: '#FF4500' },
  { name: 'Juggernaut', color: '#32CD32' },
  { name: 'Miss!', color: '#696969' },
  { name: 'Crit x2', color: '#8A2BE2' },
  { name: 'Luna', color: '#FFD700' }
];

function drawWheel() {
  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const radius = canvas.width / 2;
  const angleStep = (2 * Math.PI) / prizes.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  prizes.forEach((item, i) => {
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.fillStyle = item.color;
    ctx.arc(radius, radius, radius, angle + i * angleStep, angle + (i + 1) * angleStep);
    ctx.lineTo(radius, radius);
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + i * angleStep + angleStep / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(item.name, radius - 10, 5);
    ctx.restore();
  });
}

async function spin() {
  if (spinning) return;

  const res = await fetch('/spin', { method: 'POST' });
  const data = await res.json();

  document.getElementById('balance').innerText = data.balance;
  document.getElementById('result').innerText = `Вы выиграли: ${data.result.name}`;

  let stopIndex = Math.floor(Math.random() * prizes.length);
  let stopAngle = (stopIndex + 0.5) * ((2 * Math.PI) / prizes.length);

  spinning = true;
  let duration = 4000;
  let start = null;
  let spins = Math.random() * 10 + 10;

  function animate(timestamp) {
    if (!start) start = timestamp;
    let elapsed = timestamp - start;
    let progress = Math.min(elapsed / duration, 1);
    let easeOut = 1 - Math.pow(1 - progress, 3);
    angle = (spins * 2 * Math.PI) * easeOut - stopAngle;

    drawWheel();

    if (progress < 1) requestAnimationFrame(animate);
    else spinning = false;
  }

  requestAnimationFrame(animate);
}

async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(() => alert('Успешно зарегистрирован'));
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  document.getElementById('auth').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('balance').innerText = data.user.balance;
}