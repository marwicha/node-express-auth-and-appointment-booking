const db = require("../models");
const Appointment = db.appointment;
const User = db.user;
const Slot = db.slot;

require("dotenv").config();
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

//Templates from sendGrid account
const templates = {
  rendezvousCancelledByAdmin: "d-c79e43115e054a2c9725d7e6aa05d98e",
};

const emailPatrick = "ikdo.zen@gmail.com";

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

exports.cancelAppointmentByAdmin = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les informations à mettre à jour ne peuvent pas être vides!",
    });
  }

  const appointment = await Appointment.findById(req.params.id);

  const user = await User.findById(appointment.user._id);

  const msgRVCancelled = {
    from: `Equipe IKDO <${emailPatrick}>`,
    templateId: templates.rendezvousCancelledByAdmin,
    personalizations: [
      {
        to: [{ email: user.email }],
      },
    ],
  };

  Appointment.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update  with id=${req.params.id}. Maybe it  was not found!`,
        });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating with id=" + req.params.id,
      });
    });

  sendGridMail
    .send(msgRVCancelled)
    .then((res) => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.log(error);
    });
  res.send({
    message: "Votre rendez vous est annulé avec succès!",
  });
};
