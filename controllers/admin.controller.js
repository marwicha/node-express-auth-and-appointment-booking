const db = require("../models");
const Appointment = db.appointment;

exports.allAppointmentsAdmin = (req, res) => {
  // Returns all appointments
  Appointment.find({})
    .populate("slots")
    .exec((err, appointments) => res.json(appointments));
};
