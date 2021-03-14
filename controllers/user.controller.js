const db = require("../models");
const User = db.user;

exports.userBoard = (req, res) => {
    res.status(200).send("User Profile.");
};

// update user information
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les informations à mettre à jour ne peuvent pas être vides!"
    });
  }
  
  const id = req.params.id;

  User.findOneAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de mettre à jour les informations avec id= $ {id}. ce utilisateur n'existe pas!`
        });
      } else res.send({ message: "Vos informations ont été mises à jour avec succès." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour des informations avec id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.findOneAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer le compte!`
        });
      } else {
        res.send({
          message: "Votre compte est supprimé avec succès!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la suppression"
      });
    });
};