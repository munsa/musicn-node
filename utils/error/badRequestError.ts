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
}