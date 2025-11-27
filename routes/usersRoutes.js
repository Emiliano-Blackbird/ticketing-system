import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/users/signup
router.post('/signup', async (req, res) => {
    let user;
    user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.password,
        role: req.body.role,
    });

    try {
        await user.save();
        
        const token = jwt.sign({
            _id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.header('Authorization', token).send({
          user: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');  // Buena práctica y seguridad

    const validPassword = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!validPassword) return res.status(400).send('Invalid email or password.');  // Buena práctica y seguridad

    const token = jwt.sign({
        _id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).header('Authorization', token).json({token: token});
});

export default router;