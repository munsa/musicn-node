import express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import config = require('config');
import gravatar = require('gravatar');
const auth = require('../../middleware/auth');

// @route   GET api/auth
// @desc    Get authenticated user
// @access  Public
router.get('/', auth, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ alert: { type: 'ERROR', msg:'Server Error' }});
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
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
        return res
          .status(400)
          .json({ detail: { type: 'WARNING', msg: 'Invalid credentials' }});
      }

      // See if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ alert: { type: 'WARNING', msg: 'Invalid credentials' }}); // Same response for security reasons
      }

      // Generate token
      generateToken(user, res);
    } catch (err) {
      console.error(err.message);
      res.status(500).send({alert: { type: 'ERROR', msg: 'Server error', detail: err}});
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
