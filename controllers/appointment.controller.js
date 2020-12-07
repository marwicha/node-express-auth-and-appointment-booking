const db = require("../models");
const Appointment = db.appointment;
const Slot = db.slot


exports.allAppointments = (req, res) => {
    // Returns all appointments
    Appointment.find({}).exec((err, appointments) => res.json(appointments));
}

exports.createAppointment = async (req, res) => {
    
  const requestBody = req.body

   const newSlot = new Slot({
      slot_time: requestBody.slot_time,
      slot_date: requestBody.slot_date,
      created_at: Date.now()
    });

   await newSlot.save();

   const newAppointment = new Appointment({
    prestation: requestBody.prestation,
    booked: true,
    slots: newSlot._id,
    user: req.user.id
  });

    newAppointment.save((err, saved) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

      Appointment.find({ _id: saved._id })
        .populate("slots")
        .exec((err, appointment) => res.json(appointment));

  })
}