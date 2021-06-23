const mongoose = require("mongoose");

ObjectId = mongoose.Schema.Types.ObjectId;

const userDetails = mongoose.model(
  "userDetails",
  new mongoose.Schema({
    name: String,
    phone: Number,
    email: String,
    password: String,
    roles: [
      {
        type: ObjectId,
        ref: "Role",
      },
    ],
  })
);

module.exports = userDetails;
