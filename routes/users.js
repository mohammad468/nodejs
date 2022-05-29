const router = require("express").Router();
const { default: axios } = require("axios");
const path = require("path");
const res = require("express/lib/response");
const { userModel } = require("../models/user");
const { hashString } = require("../modules/utils");
const { isValidObjectId } = require("mongoose");

router.post("/create", async (req, res, next) => {
  try {
    const { username, password, mobile, email } = req.body;

    let user;

    // TODO : این کد ولیدیشن ایمیل و شماره تماس میباشد
    const mobileRegexp = /^09[0-9]{9}/;
    const emailRegexp = /^[a-z]+[a-z0-9\_\.]{5,}\@[a-z]{2,8}\.[a-z]{2,8}/;
    if (!mobileRegexp.test(mobile)) {
      throw { status: 400, message: "شماره موبایل وارد شده اشتباه است" };
    }
    if (!emailRegexp.test(email)) {
      throw { status: 400, message: "ایمیل وارد شده اشتباه است" };
    }

    // TODO : این کد برای ولیدیشن یوزر تکراری میباشد
    user = await userModel.findOne({ username });
    if (user) {
      throw { status: 400, message: "نام کاربری قبلا استفاده شده است" };
    }
    user = await userModel.findOne({ email });
    if (user) {
      throw { status: 400, message: "ایمیل قبلا استفاده شده است" };
    }
    user = await userModel.findOne({ mobile });
    if (user) {
      throw { status: 400, message: "شماره موبایل قبلا استفاده شده است" };
    }
    if (password.length < 6 || password.length > 16) {
      throw {
        status: 400,
        message:
          "رمز عبور شما نمیتواند کمتر از شش و بیش از شانزده کاراکتر باشد",
      };
    }
    const hashPassword = hashString(password);

    const userCreatResult = await userModel.create({
      username,
      password: hashPassword,
      email,
      mobile,
    });
    if (userCreatResult) {
      return res.json(userCreatResult);
    }
    throw { status: 500, message: "ایجاد کاربر انجام نشد" };
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const users = await userModel.find({}, { password: 0 }).sort({ _id: -1 });
    return res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      throw { status: 400, message: "شناسه کاربر را به درستی وارد کنید" };
    }
    const user = await userModel.findOne(
      { _id: id },
      { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    );
    if (!user) throw { status: 404, message: "کاربری یافت نشد" };
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
