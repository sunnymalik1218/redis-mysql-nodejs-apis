const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = {
 generateToken :  (user) => {
  const token = jwt.sign(
    {
      email: user.email,
      username: user.username,
    },
    config.auth.JWT_SECRET,
    { expiresIn: config.auth.TOKEN_EXPIRES_IN }
  );
  return token;
}
}