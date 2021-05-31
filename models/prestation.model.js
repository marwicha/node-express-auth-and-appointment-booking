const mongoose = require("mongoose");

const Prestation = mongoose.model(
  "Prestation",
  new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true}
  })
);

module.exports = Prestation;
