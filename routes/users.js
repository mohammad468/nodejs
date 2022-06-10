const router = require("express").Router();
const {
  createUser,
  listOfUser,
  getUserById,
  deleteUserById,
  updateUser,
  updateProfileImage,
} = require("../controllers/user.controller");
const { autoLogin } = require("../middleware/checkLogin");
const { upload } = require("../modules/utils");

router.post("/create", createUser);
router.get("/profile",autoLogin, (req, res, next) => {
  try {
    return res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
});
router.get("/", listOfUser);
router.get("/:id", getUserById);
router.delete("/:id", deleteUserById);
router.put("/:id", updateUser);
router.put("/profile/:id", upload.single("image"), updateProfileImage);

module.exports = router;
