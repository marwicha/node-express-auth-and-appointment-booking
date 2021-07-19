const db = require("../models");
const User = db.user;
const Appointment = db.appointment;
const Slot = db.slot;

require("dotenv").config();
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

//Templates from sendGrid account
const templates = {
  accountDeleted: "d-b0498b7d8f404673b1ce7fee8a45c1d1",
};

// update user information
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les informations à mettre à jour ne peuvent pas être vides!",
    });
  }

  User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de mettre à jour les informations avec id= ${req.params.id}. cet utilisateur n'existe pas!`,
        });
      } else
        res.send({
          message: "Vos informations ont été mises à jour avec succès.",
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Erreur lors de la mise à jour des informations avec id=" +
          req.params.id,
      });
    });
};

exports.deleteUserAndAppointments = async (req, res) => {
  const user = await User.findById(req.params.id);

  await Appointment.remove({ user: user.id });
  await Slot.remove({ user: user.id });
  await User.remove({ _id: user._id });

  const emailPatrick = "ikdo.zen@gmail.com";

  const msgDeleteAccount = {
    from: `Equipe IKDO <${emailPatrick}>`,
    templateId: templates.accountDeleted,
    personalizations: [
      {
        to: [{ email: user.email }],
      },
    ],
  };

  sendGridMail
    .send(msgDeleteAccount)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.log(error);
    });

  return res.json({
    message: "Le compte et les rendez vous d'utilisateur sont supprimés",
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
