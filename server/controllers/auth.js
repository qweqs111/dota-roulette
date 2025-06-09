const { User } = require('../db');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).send('Пользователь уже существует');

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });
    res.send('Регистрация успешна');
  } catch (e) {
    res.status(500).send('Ошибка');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Неверные данные');
  }

  req.session.user = { id: user.id, username: user.username, balance: user.balance };
  res.send({ user: req.session.user });
};