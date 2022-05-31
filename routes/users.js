const router = require("express").Router();

const {
  createUser,
  listOfUser,
  getUserById,
  deleteUserById,
  updateUser,
} = require("../controlers/user.controler");

router.post("/create", createUser);
router.get("/", listOfUser);
router.get("/:id", getUserById);
router.delete("/:id", deleteUserById);
router.put("/:id", updateUser);

module.exports = router;
