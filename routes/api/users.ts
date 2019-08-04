import express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import config = require('config');
import gravatar = require('gravatar');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('username', 'Username is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // See if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: { msg: 'User already exists' } });
      }

      // Get gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      // Create User object
      user = new User({
        username,
        email,
        avatar,
        password
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user in the db
      await user.save();

      // Generate token
      generateToken(user, res);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// TODO: Function to generate the token. Called when login and create user.
function generateToken(user, res) {
  // Create payload
  const payload = {
    user: {
      id: user.id
    }
  };

  // Sign the token
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
}

module.exports = router;
