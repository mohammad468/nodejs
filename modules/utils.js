const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

function hashString(data) {
  const salt = bcrypt.genSaltSync(13);
  const hashed = bcrypt.hashSync(data, salt);
  return hashed;
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth();
    const thisDay = new Date().getDate();
    const fileAddress = `${__dirname}/../uploads/images/${thisYear}/${thisMonth}/${thisDay}`;
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
};
