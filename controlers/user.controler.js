const { userModel } = require("../models/user");
const { hashString } = require("../modules/utils");
const { isValidObjectId } = require("mongoose");

async function createUser(req, res, next) {
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
}

async function listOfUser(req, res, next) {
  try {
    const users = await userModel.find({}, { password: 0 }).sort({ _id: -1 });
    return res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
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
}

async function deleteUserById(req, res, next) {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      throw { status: 400, message: "شناسه ارسال شده درست نمیباشد" };
    }
    const user = await userModel.findById(id);
    if (!user) {
      throw { status: 404, message: "کاربری با این مشخصات وجود نداشت" };
    }
    const result = await userModel.deleteOne({ _id: id });
    if (result.deletedCount > 0) {
      return res.json({
        status: 200,
        success: true,
        message: "کاربر با موفقیت حذف شد",
      });
    }
    throw { status: 400, message: "کاربر حذف نشد" };
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      throw { status: 400, message: "شناسه ارسال شده درست نمیباشد" };
    }
    const userFindResult = await userModel.findById(id);
    if (!userFindResult) {
      throw { status: 404, message: "کاربری با این مشخصات وجود نداشت" };
    }

    const { username, mobile, email } = req.body;
    let data = { ...req.body };
    let user;

    // TODO : این کد ولیدیشن ایمیل و شماره تماس میباشد
    const mobileRegexp = /^09[0-9]{9}/;
    const emailRegexp = /^[a-z]+[a-z0-9\_\.]{5,}\@[a-z]{2,8}\.[a-z]{2,8}/;
    if (mobile && !mobileRegexp.test(mobile)) {
      throw { status: 400, message: "شماره موبایل وارد شده اشتباه است" };
    }
    if (email && !emailRegexp.test(email)) {
      throw { status: 400, message: "ایمیل وارد شده اشتباه است" };
    }

    // TODO : این کد برای ولیدیشن یوزر تکراری میباشد
    if (username) {
      user = await userModel.findOne({ username });
    }
    if (user) {
      throw { status: 400, message: "نام کاربری قبلا استفاده شده است" };
    }
    if (email) {
      user = await userModel.findOne({ email });
    }
    if (user) {
      throw { status: 400, message: "ایمیل قبلا استفاده شده است" };
    }
    if (mobile) {
      user = await userModel.findOne({ mobile });
    }
    if (user) {
      throw { status: 400, message: "شماره موبایل قبلا استفاده شده است" };
    }

    Object.entries(data).forEach(([key, value]) => {
      if (
        !value ||
        ["", " ", ".", null, undefined].includes(value) ||
        value.length < 3
      ) {
        delete data[key];
      }
      if (!["username", "email", "mobile"].includes(key)) {
        delete data[key];
      }
    });

    const result = await userModel.updateOne({ _id: id }, { ...data });
    if (result.modifiedCount > 0) {
      return res.json({
        status: 200,
        success: true,
        message: "کاربر با موفقیت بروز شد",
      });
    }
    throw { status: 500, message: "کاربر بروز نشد" };
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  listOfUser,
  getUserById,
  deleteUserById,
  updateUser,
};
