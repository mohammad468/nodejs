const { Schema, model } = require("mongoose");
const UserSchema = new Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    age: { type: String },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const userModel = model("user", UserSchema);

module.exports = {
  userModel,
};
