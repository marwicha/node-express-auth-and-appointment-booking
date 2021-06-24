const mongoose = require("mongoose");
ObjectId = mongoose.Schema.Types.ObjectId;

const Slot = mongoose.model(
  "Slot",
  new mongoose.Schema({
    user: { type: ObjectId, ref: "User", required: true },
    slot_time: String,
    slot_date: String,
    created_at: Date,
  })
);

module.exports = Slot;
