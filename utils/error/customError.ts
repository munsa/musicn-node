import {GeneralError} from "./generalError";

/***
 * CUSTOM ERROR (500)
 */
export class CustomError extends GeneralError {
  constructor(message) {
    super(message ? message : CustomError.DEFAULT_CUSTOM_ERROR);
    this.name = 'CustomError';
  }

  getCode(): number {
    return 500;
  }

  static readonly DEFAULT_CUSTOM_ERROR = 'Server error';
  static readonly CANT_GENERATE_FINGERPRINT = 'Can\'t generate fingerprint';
  static readonly UNKNOWN_ACOUSTID_API_ERROR = 'Unknown AcoustID error';
  static readonly USER_NOT_FOUND = 'User not found';
}