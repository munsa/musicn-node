import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import {CustomError} from '../utils/error/customError';
import {getColorFromImage} from '../utils/generalFunctionsHelper';
const dotenv = require('dotenv');

dotenv.config();

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
   * @name    getUserAvatarColorByUserId
   * @param   idUser
   * @return  User
   */
  export const getUserAvatarColorByUserId = async (idUser: number) => {
    return await User.findById(idUser).select('avatarColor');
  }

  /**
   * @name    login
   * @param   username
   * @param   password
   * @return  idUser
   */
  export const login = async (username: string, password: string) => {
    // Check if user already exists
    let user = await User.findOne({$or: [{username: username}, {email: username}]});
    if (!user) {
      return null;
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user.id;
    } else {
      return null
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
      throw new CustomError(CustomError.USERNAME_ALREADY_EXISTS, CustomError.STATUS_CODE_BAD_REQUEST);
    }

    // Get Adorable Avatar
    const avatar = 'https://api.adorable.io/avatars/285/' + email + '.png';

    let avatarColor = await getColorFromImage(avatar);

    // Create User object
    user = new User({
      username,
      email,
      avatar,
      avatarColor,
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
      process.env.JWT_SECRET,
      {expiresIn: 3600},
      tokenCallback
    );
  }

  /**
   * @name    existsUsername
   * @desc    checks if already exists a user with given username
   * @param   username
   * @return  boolean
   */
  export const existsUsername = async(username: string) => {
    return await User.exists({username: username});
  }

  /**
   * @name    existsEmail
   * @desc    checks if already exists a user with given email
   * @param   email
   * @return  boolean
   */
  export const existsEmail = async(email: string) => {
    return await User.exists({email: email});
  }
}

export default UserService