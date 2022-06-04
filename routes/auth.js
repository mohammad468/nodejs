const { userRegister } = require("../controllers/auth.controller");
const router = require("express").Router();

router.post("/register", userRegister);

router.post("/login", async (req, res, next) => {
  try {
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
