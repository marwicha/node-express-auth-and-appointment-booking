const db = require("../models");
const User = db.user;
const Appointment = db.appointment;
const Slot = db.slot;

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
    phone: req.body.phone,
  };

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

exports.deleteUserAndAppointments = async (req, res) => {
  // const appointment = await Appointment.findById(req.params.id);

  // const slot = await Slot.findById(appointment.slots);

  // await Slot.findOneAndDelete({ _id: slot._id });

  // await Appointment.findOneAndDelete({ _id: req.params.id });

  const user = await User.findById(req.params.id);

  await Appointment.remove({ user: user.id });
  await Slot.remove({ user: user.id });
  await User.remove({ _id: user._id });

  return res.json({
    message: "Le compte et les rendez vous d'utilisateur sont supprimés",
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
