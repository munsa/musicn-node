import express from 'express';
import {errorHandlerWrapper} from '../../middleware/error';
import {CustomError} from '../../utils/error/customError';
import UserService from '../../services/userService';
const { body } = require('express-validator');

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
    check('email', CustomError.INVALID_EMAIL).isEmail(),
    check('password', CustomError.REQUIRED_PASSWORD).exists()
  ],
  errorHandlerWrapper(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new CustomError(errors.array(), CustomError.STATUS_CODE_BAD_REQUEST);
      }
      const {email, password} = req.body;

      const idUser = await UserService.login(email, password);

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

/**
 * @route   POST api/auth/register
 * @desc    Register user
 * @access  Public
 */
router.post(
  '/register',
  [
    check('username').not().isEmpty().isLength({min: 3}),
    check('email').isEmail(),
    check('password').isLength({min: 6}),
    body('username').custom(async (value, { req }) => {
      const existsUsername =  await UserService.existsUsername(value);
      if (existsUsername) {
        throw new Error(CustomError.USERNAME_ALREADY_EXISTS);
      }
      return true;
    }),
    body('email').custom(async (value, { req }) => {
      const existsEmail =  await UserService.existsEmail(value);
      if (existsEmail) {
        throw new Error(CustomError.EMAIL_ALREADY_EXISTS);
      }
      return true;
    })

  ],
  errorHandlerWrapper(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
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
      const result =  await UserService.existsUsername(username);
      res.json(result);
    }
  ));


module.exports = router;
