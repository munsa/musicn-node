import express = require('express');
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import config = require('config');
import gravatar = require('gravatar');
import {errorHandlerWrapper} from '../../middleware/error';
import {CustomError} from '../../utils/error/customError';

const {check, validationResult} = require('express-validator');
const User = require('../../models/User');
const router = express.Router();


const auth = require('../../middleware/auth');

/**
 * @route   GET api/auth/user
 * @desc    Get authenticated user
 * @access  Public
 */
router.get('/user', auth, errorHandlerWrapper(async (req: any, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
}));

/**
 * @route   POST api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', CustomError.INVALID_EMAIL).isEmail(),
    check('password', CustomError.REQUIRED_PASSWORD).exists()
  ],
  errorHandlerWrapper(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new CustomError({errors: errors.array()}, CustomError.STATUS_CODE_BAD_REQUEST);
      }

      const {email, password} = req.body;

      // See if user already exists
      let user = await User.findOne({email});
      if (!user) {
        throw new CustomError(CustomError.INVALID_CREDENTIALS, CustomError.STATUS_CODE_BAD_REQUEST);
      }

      // See if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Same response for security reasons
        throw new CustomError(CustomError.INVALID_CREDENTIALS, CustomError.STATUS_CODE_BAD_REQUEST);
      }

      // Generate token
      generateToken(user, res);
    }
  ));

/**
 * @route   POST api/auth/register
 * @desc    Register user
 * @access  Public
 */
router.post(
  '/register',
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
  errorHandlerWrapper(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new CustomError({errors: errors.array()}, CustomError.STATUS_CODE_BAD_REQUEST);
      }

      const {username, email, password} = req.body;

      // See if user already exists
      let user = await User.findOne({email});
      if (user) {
        throw new CustomError(CustomError.USER_ALREADY_EXISTS, CustomError.STATUS_CODE_BAD_REQUEST);
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
