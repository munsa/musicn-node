/***
 * GENERAL ERROR
 */
export class GeneralError extends Error {
  message: string = GeneralError.DEFAULT_GENERAL_ERROR;
  constructor(message) {
    super();
    // The message can be an object, stringify to show a complete message in the console trace
    this.message = message ? JSON.stringify(message) : GeneralError.DEFAULT_GENERAL_ERROR;
    this.name = 'GeneralError';
    Object.setPrototypeOf(this, new.target.prototype);
  }

  getCode() {
    return 500;
  }

  static readonly DEFAULT_GENERAL_ERROR = 'Server error';
}
