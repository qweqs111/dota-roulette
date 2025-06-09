const { User } = require('../db');

const prizes = [
  { name: 'Anti-Mage', type: 'win', amount: 200 },
  { name: 'Juggernaut', type: 'win', amount: 150 },
  { name: 'Miss!', type: 'lose' },
  { name: 'Crit x2', type: 'win', amount: 300 },
  { name: 'Luna', type: 'win', amount: 100 },
];

exports.spin = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).send('Не авторизован');

  const userData = await User.findByPk(user.id);
  if (userData.balance < 100) return res.status(400).send('Недостаточно средств');

  userData.balance -= 100;

  const prize = prizes[Math.floor(Math.random() * prizes.length)];

  if (prize.type === 'win') {
    userData.balance += prize.amount;
  }

  await userData.save();

  req.session.user.balance = userData.balance;

  res.send({
    result: prize,
    balance: userData.balance
  });
};