const mongoose = require("mongoose");

const Formation = mongoose.model(
  "Formation",
  new mongoose.Schema({
    name: { type: String, required: true },
    dateText: { type: String, required: true },
  })
);

module.exports = Formation;
