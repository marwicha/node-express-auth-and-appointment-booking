const mongoose = require("mongoose");

const Formation = mongoose.model(
  "Formation",
  new mongoose.Schema({
    name: { type: String, required: true },
    dateDebut: { type: String, required: true },
    dateFin: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: String, required: true },
  })
);

module.exports = Formation;
