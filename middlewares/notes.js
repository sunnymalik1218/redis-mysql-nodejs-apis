const Joi = require("joi");
const {RESPONSE_STATUSES} = require("../utils/responsestatuses");
const enums = require("../utils/enums"); 
const noteSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().valid('Work','Personal'),
});

const noteValidator = async (req, res, next) => {
  const { error, value } = noteSchema.validate(req.body);
  if (error) {
    res.status(RESPONSE_STATUSES.STATUS_BAD_REQUEST).send({ message: error.message });
  } else {
    next();
  }
};

module.exports = {
  noteValidator,
};
