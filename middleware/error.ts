import * as error from '../utils/error';

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

