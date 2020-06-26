import express = require('express');
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import config = require('config');
import gravatar = require('gravatar');

const router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../../models/User');
import {handleErrorWrapper} from "../../middleware/error";
import {BadRequestError} from "../../utils/error/badRequestError";

const auth = require('../../middleware/auth');

// @route   GET api/auth/user
// @desc    Get authenticated user
// @access  Public
router.get('/user', auth, handleErrorWrapper(async (req: any, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
}));

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', BadRequestError.INVALID_EMAIL).isEmail(),
    check('password', BadRequestError.REQUIRED_PASSWORD).exists()
  ],
  handleErrorWrapper(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError({errors: errors.array()});
      }

      const {email, password} = req.body;

      // See if user already exists
      let user = await User.findOne({email});
      if (!user) {
        throw new BadRequestError(BadRequestError.INVALID_CREDENTIALS);
      }

      // See if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new BadRequestError(BadRequestError.INVALID_CREDENTIALS); // Same response for security reasons
      }

      // Generate token
      generateToken(user, res);
    }
  ));

// @route   POST api/auth/register
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
    ).isLength({min: 6})
  ],
  handleErrorWrapper(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError({errors: errors.array()});
      }

      const {username, email, password} = req.body;

      // See if user already exists
      let user = await User.findOne({email});
      if (user) {
        throw new BadRequestError(BadRequestError.USER_ALREADY_EXISTS);
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
    }
  ));

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
    {expiresIn: 3600},
    (err, token) => {
      if (err) {
        throw err;
      }
      res.json({token});
    }
  );
}

module.exports = router;
