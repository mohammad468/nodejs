const path = require("path");

function notFound(req, res, next) {
  const htmlFile = require("fs").readFileSync(
    path.join(__dirname, "404.html"),
    "utf-8"
  );
  return res
    .status(404)
    .json({
      status: 404,
      success: false,
      message: "this router its not found",
    })
    .send(
      htmlFile
        .replace("TITLE_ERROR", "مسیر یافت نشد")
        .replace("MESSAGE_ERROR", "محتوا یا مسیر مورد نظر یافت نشد")
    );
}

function expressErrorHandler(error, req, res, next) {
  const status = error?.status || 500;
  const message = error?.message || "internal server error";
  return res.status(status).json({
    status,
    success: false,
    message,
  });
}

module.exports = { notFound, expressErrorHandler };
