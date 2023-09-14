const Joi = require("joi");
const {RESPONSE_STATUSES} = require("../utils/responsestatuses");
const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
const loginValidator = async (req, res, next) => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    res.status(RESPONSE_STATUSES.STATUS_BAD_REQUEST).send({ message: error.message });
  } else {
    next();
  }
};

const registerValidator = async (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    res.status(RESPONSE_STATUSES.STATUS_BAD_REQUEST).send({ message: error.message });
  } else {
    next();
  }
};

module.exports = {
  registerValidator,
  loginValidator,
};
