const bcrypt = require("bcrypt");

function hashString(data) {
  const salt = bcrypt.genSaltSync(13);
  const hashed = bcrypt.hashSync(data, salt);
  return hashed;
}

module.exports = {
  hashString,
};
