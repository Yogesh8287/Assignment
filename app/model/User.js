const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    minlength: 5,
    maxlength: 10,
    required: true,
  },
  lastname: {
    type: String,
    minlength: 4,
    maxlength: 10,
    required: true,
  },
  username: {
    type: String,
    minlength: 6,
    maxlength: 12,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
});

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

userSchema.methods.generateAuthToken = function () {
  const payload = {
    _id: this._id,
    username: this.username
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
const User = mongoose.model("user", userSchema);

module.exports = User;
