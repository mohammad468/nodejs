const express = require("express");
const http = require("http");
const userRoutes = require("./routes/users");
const mongoose = require("mongoose");
const { notFound, expressErrorHandler } = require("./modules/errorHandler");
const path = require("path");
mongoose.connect("mongodb://localhost:27017/TaskManagerDB", (error) => {
  if (!error) {
    console.log("connected to mongoBD");
  }
});
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.get("/", (req, res, next) => {
  res.send("hello");
});

app.use("/users", userRoutes);
app.use(expressErrorHandler);
app.use(notFound);

http.createServer(app).listen(3500, () => {
  console.log("server run in port 3500");
});
