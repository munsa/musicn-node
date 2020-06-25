/***
 * GENERAL ERROR
 */
export class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    if (this instanceof BadRequestError) {
      return 400;
    } if (this instanceof NotFoundError) {
      return 404;
    } if (this instanceof CustomError) {
      return 500;
    }
    return 500;
  }
}

/***
 * BAD REQUEST ERROR
 */
export class BadRequestError extends GeneralError {
  constructor(message) {
    if(!message) {
      message = BadRequestError.DEFAULT_ERROR;
    }
    super(message)
    this.name = 'BadRequest';
  }

  static readonly DEFAULT_ERROR = 'Bad request';
}

/***
 * NOT FOUND ERROR
 */
export class NotFoundError extends GeneralError {
  constructor(message) {
    if(!message) {
      message = NotFoundError.DEFAULT_ERROR;
    }
    super(message)
    this.name = 'NotFound'
  }

  static readonly DEFAULT_ERROR = 'Not found';
}

/***
 * CUSTOM ERROR
 */
export class CustomError extends GeneralError {
  constructor(message) {
    super(message)
    this.name = 'CustomError'
  }

  static readonly CANT_GENERATE_FINGERPRINT = 'Can\'t generate fingerprint';
  static readonly UNKNOWN_ACOUSTID_API_ERROR = 'Unknown AcoustID error';
  static readonly USER_NOT_FOUND = 'User not found';
}
