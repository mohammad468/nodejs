const { taskModel } = require("../models/tasks");

async function createTask(req, res, next) {
  try {
    const {
      title,
      text,
      category,
      user = req.user._id,
      status = "pending",
    } = req.body;
    const result = await taskModel.create({
      text,
      title,
      category,
      user,
      status,
      expiresIn: Date.now() + 1000 * 60 * 60 * 24 * 30,
    });
    if (!result) {
      throw { status: 500, message: "آیتم ثبت نشد" };
    }
    return res.status(201).json({
      status: 201,
      success: true,
      message: "ثبت و ذخیره تسک با موفقیت انجام شد",
    });
  } catch (error) {
    next(error);
  }
}

async function getAllTask(req, res, next) {
  try {
    const userID = req.user._id;
    const tasks = await taskModel.find({ user: userID }).sort({ _id: -1 });
    return res.status(200).json({
      status: 200,
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const userID = req.user._id;
    const taskID = req.params.id;
    const task = await taskModel.findOne({ user: userID, _id: taskID });
    if (!task) {
      throw { status: 404, message: "آیتمی یافت نشد" };
    }
    return res.status(200).json({
      status: 200,
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id: _id } = req.params;
    const user = req.user._id;
    const task = await taskModel.findOne({ _id, user });
    if (!task) {
      throw {
        status: 404,
        message: "تسکی یافت نشد",
      };
    }
    const data = { ...req.body };
    Object.entries(data).forEach(([key, value]) => {
      if (
        !value ||
        ["", " ", ".", null, undefined].includes(value) ||
        value.length < 3
      ) {
        delete data[key];
      }
      if (!["title", "text", "category"].includes(key)) {
        delete data[key];
      }
    });
    const updateTaskResult = await taskModel.updateOne(
      { _id },
      {
        $set: {
          ...data,
        },
      }
    );
    if (updateTaskResult.modifiedCount > 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "بروزرسانی با موفقیت انجام شد",
      });
    }
    throw {
      status: 400,
      message: "بروز رسانی انجام نشد",
    };
  } catch (error) {
    next(error);
  }
}

async function removeTaskById(req, res, next) {
  try {
    const { id: _id } = req.params;
    const userID = req.user._id;
    const task = await taskModel.findOne({ _id, userID });
    if (!task) {
      throw { status: 404, message: "تسکی یافت نشد" };
    }
    const removeResult = await taskModel.deleteOne({ _id });
    if (!removeResult.deletedCount > 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "حذف تسک با موفقیت انجام شد",
      });
    }
    throw {
      status: 500,
      message: "حذف تسک انجام نشد",
    };
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  removeTaskById,
};
