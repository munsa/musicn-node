export class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    if (this instanceof BadRequest) {
      return 400;
    } if (this instanceof NotFound) {
      return 404;
    } if (this instanceof CustomError) {
      return 500;
    }
    return 500;
  }
}

export class BadRequest extends GeneralError { }
export class NotFound extends GeneralError { }
export class CustomError extends GeneralError {
  constructor(message) {
    super(message)
    this.name = 'CustomError'
  }

  static readonly CANT_GENERATE_FINGERPRINT = 'Can\'t generate fingerprint';
  static readonly UNKNOWN_ACOUSTID_API_ERROR = 'Unknown AcoustID error';
  static readonly USER_NOT_FOUND = 'Unknown AcoustID error';
}