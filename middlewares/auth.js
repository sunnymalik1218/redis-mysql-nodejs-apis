const jwt = require("jsonwebtoken");
const config = require("../config/config");
const {RESPONSE_MESSAGES} = require("../utils/responsemessages");
const {RESPONSE_STATUSES} = require("../utils/responsestatuses");
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(RESPONSE_STATUSES.STATUS_UNAUTHORIZED).send({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
  } else {
    jwt.verify(token, config.auth.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(RESPONSE_STATUSES.STATUS_UNAUTHORIZED).send({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};

module.exports = {
  verifyToken,
};
