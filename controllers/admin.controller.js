const db = require("../models");
const Appointment = db.appointment;
const Formation = db.formation;

exports.allAppointmentsAdmin = (req, res) => {
  // Returns all appointments
  Appointment.find({})
    .populate("slots")
    .exec((err, appointments) => res.json(appointments));
};

exports.addFormation = (req, res) => {
  const requestBody = req.body;

  const newFormation = new Formation({
    name: requestBody.name,
    dateText: requestBody.dateText,
  });

  newFormation.save((err, saved) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Appointment.find({ _id: saved._id }).exec((err, appointment) =>
      res.json(appointment)
    );
  });
};

exports.allFormations = (req, res) => {
  Formation.find({}).exec((err, formations) => res.json(formations));
};

exports.updateFormation = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les informations à mettre à jour ne peuvent pas être vides!",
    });
  }

  const id = req.params.id;

  Formation.findOneAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de mettre à jour les informations avec id= $ {id}!`,
        });
      } else
        res.send({
          message: "Informations ont été mises à jour avec succès.",
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour des informations avec id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Formation.findOneAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer la formation!`,
        });
      } else {
        res.send({
          message: "Formation supprimée avec succès!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur lors de la suppression",
      });
    });
};
