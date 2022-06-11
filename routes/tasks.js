const {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  removeTaskById,
} = require("../controllers/task.controller");

const router = require("express").Router();

router.get("/", getAllTask);

router.get("/:id", getTaskById);

router.post("/create", createTask);

router.put("/update/:id", updateTask);

router.delete("/remove/:id", removeTaskById);

module.exports = router;
