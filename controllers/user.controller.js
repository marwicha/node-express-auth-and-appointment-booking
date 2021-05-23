const db = require("../models");
const User = db.user;
const Appointment = db.appointment;
const Slot = db.slot;

// BCYPT PASSWORD
var bcrypt = require("bcryptjs");

// update user information
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les informations à mettre à jour ne peuvent pas être vides!",
    });
  }
  const id = req.params.id;

  const reqBody = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    phone: req.body.phone
  }

  User.findOneAndUpdate(id, reqBody, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de mettre à jour les informations avec id= $ {id}. ce utilisateur n'existe pas!`,
        });
      } else
        res.send({
          message: "Vos informations ont été mises à jour avec succès.",
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour des informations avec id=" + id,
      });
    });
};

exports.deleteUserAndAppointments = (req, res) => {
  return Appointment.find({ user: req.user.id }).then((appointment) => {
    User.findOneAndDelete(appointment.user).then(() => {
      Appointment.findOneAndDelete({ appointment: appointment._id });
    });
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
