import express from 'express';
import {errorHandlerWrapper} from '../../middleware/error';
import {CustomError} from '../../utils/error/customError';
import UserService from '../../services/userService';

const {body} = require('express-validator');

const {check, validationResult} = require('express-validator');
const router = express.Router();


const auth = require('../../middleware/auth');

/**
 * @route   GET api/auth/user
 * @desc    Get authenticated user
 * @access  Public
 */
router.get('/user', auth, errorHandlerWrapper(async (req: any, res) => {
  const user = await UserService.getUserById(req.user.id);
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
    check('username').exists(),
    check('password').exists()
  ],
  errorHandlerWrapper(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(CustomError.STATUS_CODE_BAD_REQUEST).json({errors: errors.array()});
      }
      const {username, password} = req.body;

      const idUser = await UserService.login(username, password);

      if (idUser) {
        UserService.generateToken(idUser, (err, token) => {
          if (err) {
            throw new CustomError(CustomError.ERROR_SIGNING_TOKEN);
          }
          res.json({token});
        })
      } else {
        return res.status(CustomError.STATUS_CODE_BAD_REQUEST).json({
          errors: [
            {param: 'username', msg: ' '},
            {param: 'password', msg: CustomError.INVALID_CREDENTIALS}
            ]});
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
    check('username').exists().not().isEmpty().isLength({min: 3}).custom(async (value, {req}) => {
      const existsUsername = await UserService.existsUsername(value);
      if (existsUsername) {
        throw new Error(CustomError.USERNAME_ALREADY_EXISTS);
      }
      return true;
    }),
    check('email').exists().isEmail().custom(async (value, {req}) => {
      const existsEmail = await UserService.existsEmail(value);
      if (existsEmail) {
        throw new Error(CustomError.EMAIL_ALREADY_EXISTS);
      }
      return true;
    }),
    check('password').exists().isLength({min: 6})
  ],
  errorHandlerWrapper(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(CustomError.STATUS_CODE_BAD_REQUEST).json({errors: errors.array()});
      }
      const {username, email, password} = req.body;

      const idUser = await UserService.register(username, email, password);
      if (idUser) {
        UserService.generateToken(idUser, (err, token) => {
          if (err) {
            throw new CustomError(CustomError.ERROR_SIGNING_TOKEN);
          }
          res.json({token});
        })
      }
    }
  ));

router.get(
  '/existsUsername/:username', errorHandlerWrapper(async ({params: {username}}, res) => {
      const result = await UserService.existsUsername(username);
      res.json(result);
    }
  ));


module.exports = router;
