import {CustomError} from '../utils/error/customError';

const Recording = require('../models/Recording');
const User = require('../models/User');

export module ProfileService {
  export const getProfileByUsername = async (username: string) => {
    const user = await User.findOne({username: username});
    if (user) {
      const recordings = user ? await Recording.find({user: user.id}).limit(10).sort('-date') : '';

      const profile = {
        user: user,
        recordings: recordings
      }

      return profile;
    } else {
      throw new CustomError(CustomError.USER_DOESNT_EXIST)
    }
  }
}