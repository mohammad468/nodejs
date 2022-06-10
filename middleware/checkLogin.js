const { userModel } = require("../models/user");
const { verifyJwtToken } = require("../modules/utils");

async function autoLogin(req, res, next) {
  try {
    req.user = null;
    req.isLogin = false;
    const headers = req?.headers;
    // console.log(headers.authorization.substring(7));
    const token = headers?.authorization?.substring(7);
    if (!token) {
      throw { status: 401, message: "لطفا وارد حساب کاربری خود شوید" };
    }
    const payload = verifyJwtToken(token);
    const user = await userModel.findOne({ username: payload.username });
    if (!user) {
      throw { status: 401, message: "لطفا مجددا وارد حساب کاربری خود شوید" };
    }
    req.user = user;
    req.isLogin = true;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  autoLogin,
};
