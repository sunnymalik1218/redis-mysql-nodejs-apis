const User = require("../models/users");
const bcryptUtils = require("../utils/bcrypt");
const jwtUtils = require("../utils/jwt");
const { RESPONSE_MESSAGES } = require("../utils/responsemessages");
const { RESPONSE_STATUSES } = require("../utils/responsestatuses");

module.exports = {
  register: async (req, res) => {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const password = bcryptUtils.encryptPassword(req.body.password);
      // check if user already exists
      const userExists = await User.findOne({
        where: {
          email: email,
        },
      });
      if (userExists) {
        return res.status(RESPONSE_STATUSES.STATUS_BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.USER_ALREADY_EXISTS,
        });
      }

      const user = await User.create({
        username: username,
        email: email,
        password: password,
      });
      delete user.dataValues.password;
      return res.status(RESPONSE_STATUSES.STATUS_OK).json({
        message: RESPONSE_MESSAGES.SUCCESSFULLY_REGISTERED,
        user,
      });
    } catch (error) {
      return res.status(RESPONSE_STATUSES.STATUS_SERVER_ERROR).json({
        message: RESPONSE_MESSAGES.SERVER_TEMPORY_DOWN,
        error: error.errors[0].message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(RESPONSE_STATUSES.STATUS_BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.INVALID_CREDENTIALS,
        });
      }
      const isMatch = bcryptUtils.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(RESPONSE_STATUSES.STATUS_BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.INVALID_CREDENTIALS,
        });
      }
      const authentication_token = jwtUtils.generateToken(user);
      delete user.dataValues.password;
      return res.status(RESPONSE_STATUSES.STATUS_OK).json({
        message: RESPONSE_MESSAGES.SUCCESSFULLY_LOGIN,
        user,
        token: authentication_token,
      });
    } catch (error) {
      return res.status(RESPONSE_STATUSES.STATUS_SERVER_ERROR).json({
        message: RESPONSE_MESSAGES.SERVER_TEMPORY_DOWN,
        error: error.errors[0].message,
      });
    }
  },
};
