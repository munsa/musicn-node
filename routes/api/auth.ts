import express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('..//../models/User');
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import config = require('config');
import gravatar = require('gravatar');
const auth = require('../../middleware/auth');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.get('/', auth, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token user
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user already exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: { msg: 'Invalid credentials' } });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: { msg: 'Invalid credentials' } }); // Same response for security reasons
      }

      // Create payload
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
