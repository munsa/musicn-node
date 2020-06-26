import * as error from '../utils/error/generalError';

/***
 * express app has an error handler middleware that gets 4 parameters (err, req, res, next)
 * express router middleware does not accept 4 parameters
 * this function is a wrapper used on each function that wants to handle errors
 */
export const handleErrorWrapper = func => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (err) {
    console.log(err);
    return res.status(err instanceof error.GeneralError ? err.getCode() : 500).json({
      status: 'error',
      message: JSON.parse(err.message) // Parse back the message, stringify in GeneralError class
    });
  }
};

