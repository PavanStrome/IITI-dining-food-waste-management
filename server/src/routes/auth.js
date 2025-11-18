import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { Ticket } from '../models/Ticket.js';
import { Feedback } from '../models/Feedback.js';
import { MESS_OPTIONS } from '../utils/constants.js';

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, mess } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    if (role === 'staff' && (!mess || !MESS_OPTIONS.includes(mess))) {
      return res.status(400).json({ message: 'Staff must select a valid mess' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: role || 'student', mess: role === 'staff' ? mess : null });
    return res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, mess: user.mess });
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ sub: String(user._id), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, mess: user.mess } });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' });
  }
});

export default router;

// Delete own account
router.delete('/me', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    await Promise.all([
      Ticket.deleteMany({ student: userId }),
      Feedback.deleteMany({ student: userId }),
    ]);
    await User.findByIdAndDelete(userId);
    return res.json({ message: 'Account deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete account' });
  }
});



