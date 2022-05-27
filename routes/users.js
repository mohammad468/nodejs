const router = require("express").Router();
const { default: axios } = require("axios");
const path = require("path");
const res = require("express/lib/response");
const { userModel } = require("../models/user");

router.get("/", async (req, res, next) => {
  try {
    const users = await axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.data);
    return res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const users = await axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.data);
    const user = users.find((item) => item.id == id);
    if (!user) throw { status: 404, message: "user not found" };
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const { username, password, mobile, email } = req.body;

    // TODO : این کد برای ولیدیشن یوزر تکراری میباشد
    let user;
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

    const userCreatResult = await userModel.create({
      username,
      password,
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

module.exports = router;
