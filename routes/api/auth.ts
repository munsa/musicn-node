import express from 'express';
import {errorHandlerWrapper} from '../../middleware/error';
import {CustomError} from '../../utils/error/customError';
import {AuthService} from '../../services/authService';

const {check, validationResult} = require('express-validator');
const router = express.Router();


const auth = require('../../middleware/auth');

/**
 * @route   GET api/auth/user
 * @desc    Get authenticated user
 * @access  Public
 */
router.get('/user', auth, errorHandlerWrapper(async (req: any, res) => {
  const user = await AuthService.getUserById(req.user.id);
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

      const idUser = await AuthService.login(email, password);

      if (idUser) {
        AuthService.generateToken(idUser, (err, token) => {
          if (err) {
            throw new CustomError(CustomError.ERROR_SIGNING_TOKEN);
          }
          res.json({token});
        })
      }
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

      const idUser = await AuthService.register(username, email, password);
      if (idUser) {
        AuthService.generateToken(idUser, (err, token) => {
          if (err) {
            throw new CustomError(CustomError.ERROR_SIGNING_TOKEN);
          }
          res.json({token});
        })
      }
    }
  ));


module.exports = router;
