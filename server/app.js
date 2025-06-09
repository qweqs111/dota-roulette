const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const { sequelize } = require('./db');
const { register, login } = require('./controllers/auth');
const { spin } = require('./controllers/roulette');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Routes
app.post('/register', register);
app.post('/login', login);
app.post('/spin', spin);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});