const mongoose = require("mongoose");
ObjectId = mongoose.Schema.Types.ObjectId;


const Appointment = mongoose.model(
   "Appointment",
  new mongoose.Schema({
   //id: ObjectId,
   date: String,
   time: String,
   prestation: String,
   booked: Boolean
})
)

module.exports = Appointment