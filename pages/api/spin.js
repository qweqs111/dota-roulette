// pages/api/spin.js
import { User } from '../../db';

const prizes = [
  { name: 'Anti-Mage', amount: 200 },
  { name: 'Juggernaut', amount: 150 },
  { name: 'Miss!', amount: 0 },
  { name: 'Crit x2', amount: 300 },
  { name: 'Luna', amount: 100 },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    if (user.balance < 100) return res.status(400).json({ error: 'Недостаточно средств' });

    user.balance -= 100;
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    user.balance += prize.amount;

    await user.save();

    return res.status(200).json({
      result: prize,
      balance: user.balance
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Ошибка прокрутки' });
  }
}