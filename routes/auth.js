const { userRegister } = require("../controllers/auth.controller");
const { userModel } = require("../models/user");
const { compareDataWithHash, jwtTokenGenerator } = require("../modules/utils");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/register", userRegister);

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let user = await userModel.findOne({ username });
    if (!user) {
      throw { status: 401, message: "نام کاربری یا رمز عبور صحیح نیست" };
    }
    if (!compareDataWithHash(password, user.password)) {
      throw { status: 401, message: "نام کاربری یا رمز عبور صحیح نیست" };
    }

    let token = jwtTokenGenerator(user);
    user.token = token;
    user.save();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "ورود شما موفقیت آمیز بود",
      token,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

module.exports = router;
