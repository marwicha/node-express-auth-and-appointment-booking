const mongoose = require("mongoose");

ObjectId = mongoose.Schema.Types.ObjectId;

const Token = mongoose.model(
  "Token",
  new mongoose.Schema({
    userId: {
      type: ObjectId,
      required: true,
      ref: "User",
    },

    token: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // this is the expiry time in seconds
    },
  })
);

module.exports = Token;
