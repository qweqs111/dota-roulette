// pages/api/register.js
import { User } from '../../db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;

  try {
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ error: 'Пользователь уже существует' });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Ошибка регистрации' });
  }
}