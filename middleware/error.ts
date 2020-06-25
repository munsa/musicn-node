import * as error from '../utils/error';

/***
 * express app has an error handler middleware that gets 4 parameters (err, req, res, next)
 * express router middleware does not accept 4 parameters
 * this function is a wrapper used on each function that wants to handle errors
 */
export const handleErrorAsync = func => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (err) {
    if (err instanceof error.GeneralError) {
      return res.status(err.getCode()).json({
        status: 'error',
        message: err.message
      });
    }
    return res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

