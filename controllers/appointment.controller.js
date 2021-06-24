const db = require("../models");
const Appointment = db.appointment;
const Slot = db.slot;

require("dotenv").config();
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.allAppointments = (req, res) => {
  // Returns all appointments
  Appointment.find({})
    .populate("slots")
    .exec((err, appointments) => res.json(appointments));
};

exports.getUserAppointments = (req, res) => {
  return Appointment.find({ user: req.user.id })
    .populate("slots")
    .exec((err, appointments) => res.json(appointments));
};

exports.createAppointment = async (req, res) => {
  const requestBody = req.body;

  const newSlot = new Slot({
    slot_time: requestBody.slot_time,
    slot_date: requestBody.slot_date,
    created_at: Date.now(),
    user: req.user.id,
  });

  await newSlot.save();

  const newAppointment = new Appointment({
    prestation: requestBody.prestation,
    slots: newSlot._id,
    user: req.user.id,
  });

  newAppointment.save((err, saved) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Appointment.find({ _id: saved._id })
      .populate("slots")
      .exec((err, appointment) => res.json(appointment));
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  const body =
    "Rendez vous annulé Vous recevrer un remboursement sous quelques jours";
  const msg = {
    to: "marwa.rekik.pro@gmail.com",
    from: "marwa.rekik.pro@gmail.com",
    subject: "Rendez vous annulé",
    text: body,
    html: `<strong>${body}</strong>`,
  };

  Appointment.find({ id: id }).then((appointment) => {
    Slot.findOneAndDelete(appointment.slots).then(() => {
      Appointment.findOneAndDelete(id)
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Impossible de supprimer le rendez vous!`,
            });
          } else {
            res.send({
              message: "Votre rendez vous est annulé avec succès!",
            });
            sendGridMail
              .send(msg)
              .then(() => {
                console.log("Email sent");
              })
              .catch((error) => {
                console.error(error);
              });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Erreur lors de la suppression",
          });
        });
    });
  });
};
