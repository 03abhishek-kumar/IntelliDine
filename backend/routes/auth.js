const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'hackathon_secret', {
    expiresIn: '30d',
  });
};

router.post('/login', async (req, res) => {
  const { role, password } = req.body;

  try {
    // For simplicity in UI, we might just pass 'chef', 'customer', 'reception' as the role rather than a specific username.
    // The seeder will create one user per role and the password will be 'password' for all
    const user = await User.findOne({ role });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
