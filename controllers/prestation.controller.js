const db = require("../models");
const Prestation = db.prestation;

exports.allPrestations = (req, res) => {
  Prestation.find({}).exec((err, prestations) => res.json(prestations));
};

exports.createPrestation = async (req, res) => {
  const requestBody = req.body;

  const newPrestation = new Prestation({
    name: requestBody.name,
    price: requestBody.price,
  });

  newPrestation.save((err, saved) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Prestation.findOne({ _id: saved._id }).exec((err, prestation) =>
      res.json(prestation)
    );
  });
};

// update user information
exports.updatePrestation = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les informations à mettre à jour ne peuvent pas être vides!",
    });
  }

  const id = req.params.id;

  Prestation.findOneAndUpdate(id, req.body, { useFindAndModify: false })
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

  Prestation.findOneAndDelete({ _id: id })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer la prestation!`,
        });
      } else {
        res.send({
          message: "Prestation supprimée avec succès!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur lors de la suppression",
      });
    });
};
