const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      minlength: 6,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
  },
  { timestamps: true }
);

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

userSchema.methods.generateAuthToken = function () {
  const payload = {
    _id: this._id,
    username: this.username,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const User = mongoose.model("user", userSchema);

module.exports = User;
