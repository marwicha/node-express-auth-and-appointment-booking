const db = require("../models");
const Appointment = db.appointment;
const User = db.user;
const Slot = db.slot;

exports.allAppointmentsAdmin = async (req, res) => {
  // Returns all appointments
  await Appointment.find()
    .populate([
      {
        path: "user",
        model: User,
      },
      {
        path: "slots",
        model: Slot,
      },
    ])
    .exec((err, appointments) => res.json(appointments));
};
