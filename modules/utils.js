const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, EXPIRES_IN } = require("../configs/constants");

function hashString(data) {
  const salt = bcrypt.genSaltSync(13);
  const hashed = bcrypt.hashSync(data, salt);
  return hashed;
}

function compareDataWithHash(data, hashedString) {
  return bcrypt.compareSync(data, hashedString);
}

function jwtTokenGenerator(payload) {
  // new Date().getDate() + 1000 * 60 * 60 * 24 * day; //expiresIn nth days
  const { username } = payload;
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: EXPIRES_IN });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth();
    const thisDay = new Date().getDate();
    const fileAddress = `${__dirname}/../public/uploads/images/${thisYear}/${thisMonth}/${thisDay}`;
    require("fs").mkdirSync(fileAddress, { recursive: true });
    callback(null, fileAddress);
  },
  filename: (req, file, callback) => {
    const type = path.extname(file.originalname);
    callback(null, String(Date.now()) + type);
  },
});
const upload = multer({ storage });

module.exports = {
  hashString,
  upload,
  compareDataWithHash,
  jwtTokenGenerator,
};
