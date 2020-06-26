import {GeneralError} from "./generalError";

/***
 * NOT FOUND ERROR (404)
 */
export class NotFoundError extends GeneralError {
  constructor(message) {
    super(message ? message : NotFoundError.DEFAULT_NOT_FOUND_ERROR);
    this.name = 'NotFound'
    new Error();
  }

  getCode(): number {
    return 404;
  }

  static readonly DEFAULT_NOT_FOUND_ERROR = 'Not found';
}