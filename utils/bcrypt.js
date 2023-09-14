const bcrypt = require("bcrypt");

module.exports = {
  encryptPassword: (password) => {
    const encryptPassword = bcrypt.hashSync(password, 10);
    return encryptPassword;
  },

  comparePassword: (password, encryptPassword) => {
    const comparePassword = bcrypt.compareSync(password, encryptPassword);
    return comparePassword;
  },
};
