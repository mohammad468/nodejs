const { userModel } = require("../models/user");
const { hashString } = require("../modules/utils");

async function userRegister(req, res, next) {
  try {
    const { email, mobile, username, password, config_password } = req.body;

    // TODO : این کد ولیدیشن ایمیل ، شماره تماس و پسورد میباشد
    const mobileRegexp = /^09[0-9]{9}/;
    const emailRegexp = /^[a-z]+[a-z0-9\_\.]{5,}\@[a-z]{2,8}\.[a-z]{2,8}/;
    if (!mobileRegexp.test(mobile)) {
      throw { status: 400, message: "شماره موبایل وارد شده اشتباه است" };
    }
    if (!emailRegexp.test(email)) {
      throw { status: 400, message: "ایمیل وارد شده اشتباه است" };
    }
    if (password.length < 6 || password.length > 16) {
      throw {
        status: 400,
        message:
          "رمز عبور شما نمیتواند کمتر از شش و بیش از شانزده کاراکتر باشد",
      };
    }
    if (password !== config_password) {
      throw {
        status: 400,
        message: "رمز عبور با تکرار آن یکسان نمیاشد",
      };
    }

    let user = await userModel.findOne({ email });
    if (user) throw { status: 400, message: "ایمیل تکراری است" };
    user = await userModel.findOne({ mobile });
    if (user) throw { status: 400, message: "موبایل تکراری است" };
    user = await userModel.findOne({ username });
    if (user) throw { status: 400, message: "نام کاربری تکراری است" };

    await userModel
      .create({
        mobile,
        username,
        email,
        password: hashString(password),
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "خطا در ایجاد نام کاربری",
          error,
        });
      });

    return res.status(201).json({
      status: 201,
      success: true,
      message:
        "حساب کاربری شما با موفقیت ایجاد شد لطفا جهت ورود به سایت وارد حساب کاربری خود شوید",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  userRegister,
};