import {GeneralError} from "./generalError";

/***
 * BAD REQUEST ERROR (400)
 */
export class BadRequestError extends GeneralError {
  constructor(message) {
    super(message ? message : BadRequestError.DEFAULT_BAD_REQUEST_ERROR);
    this.name = 'BadRequest';
  }

  getCode(): number {
    return 400;
  }

  static readonly DEFAULT_BAD_REQUEST_ERROR = 'Bad request';
  static readonly INVALID_CREDENTIALS = 'Invalid credentials';
  static readonly INVALID_EMAIL = 'Please include a valid email';
  static readonly REQUIRED_PASSWORD = 'Password is required';
  static readonly USER_ALREADY_EXISTS = 'User already exists';
  static readonly USER_DOESNT_EXIST = 'User doesn\'t exist';
}