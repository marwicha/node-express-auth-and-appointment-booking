const mongoose = require("mongoose");

ObjectId = mongoose.Schema.Types.ObjectId;

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roles: [
      {
        type: ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;