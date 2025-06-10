// pages/api/login.js
import { User } from '../../db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Неверные данные' });
    }

    // Для Vercel нет сессий — сохраняем id пользователя в ответе
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        balance: user.balance
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Ошибка входа' });
  }
}