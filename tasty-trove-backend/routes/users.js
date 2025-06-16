const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// Route to create user
router.post('/', async (req, res) => {
  const { uid, name, email } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(200).json({ message: 'User already exists' });
    }

    const newUser = new User({ uid, name, email });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get user profile by UID
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
