import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

//REGISTER
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('All fields are required');
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      res.status(400);
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
});

//LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('All fields are required');
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400);
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
