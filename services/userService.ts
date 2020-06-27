import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import config = require('config');


import gravatar = require('gravatar');
import {CustomError} from '../utils/error/customError';

const User = require('../models/User');

export module UserService {
  /**
   * @name    getUserById
   * @param   idUser
   * @return  User
   */
  export const getUserById = async (idUser: number) => {
    return await User.findById(idUser).select('-password');
  }

  /**
   * @name    getUserByUsername
   * @param   username
   * @return  User
   */
  export const getUserByUsername = async (username: string) => {
    return await User.findOne({username: username}).select('-password');
  }

  /**
   * @name    login
   * @param   email
   * @param   password
   * @return  idUser
   */
  export const login = async (email: string, password: string) => {
    // See if user already exists
    let user = await User.findOne({email});
    if (!user) {
      throw new CustomError(CustomError.INVALID_CREDENTIALS, CustomError.STATUS_CODE_BAD_REQUEST);
    }

    // See if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user.id;
    } else {
      // Same response for security reasons
      throw new CustomError(CustomError.INVALID_CREDENTIALS, CustomError.STATUS_CODE_BAD_REQUEST);
    }
  }

  /**
   * @name    register
   * @param   username
   * @param   email
   * @param   password
   * @return  idUser
   */
  export const register = async (username: string, email: string, password: string) => {
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

    return user.id;
  }

  /**
   * @name    generateToken
   * @param   idUser
   * @param   tokenCallback
   * @return  void
   */
  export const generateToken = (idUser: number, tokenCallback: (err, token) => void): void => {
    // Create payload
    const payload = {
      user: {
        id: idUser
      }
    };

    // Sign the token
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      {expiresIn: 3600},
      tokenCallback
    );
  }


}