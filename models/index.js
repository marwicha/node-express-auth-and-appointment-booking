const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.appointment = require("./appointment.model");
db.slot = require("./slot.model");
db.prestation = require("./prestation.model");
db.formation = require("./formation.model");
db.token = require("./token.model");
db.ROLES = ["user", "admin"];

module.exports = db;
