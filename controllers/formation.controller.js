const db = require("../models");
const Formation = db.formation;
require("dotenv").config();
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

//Templates from sendGrid account
const templates = {
  formationAdded: "d-5189025449c147c8ad47ac8cd6aff15e",
};

exports.addFormation = (req, res) => {
  const requestBody = req.body;

  const newFormation = new Formation({
    name: requestBody.name,
    dateText: requestBody.dateText,
    description: requestBody.description,
    prix: requestBody.prix,
  });

  newFormation.save((err, saved) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    const emailPatrick = "marwa.rekik.pro@gmail.com";

    const workshopAdded = {
      from: `Equipe IKDO <${emailPatrick}>`,
      templateId: templates.formationAdded,
      personalizations: [
        {
          to: [{ email: emailPatrick }],
          body: "HELLO",
        },
      ],
    };

    sendGridMail
      .send(workshopAdded)
      .then((res) => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.log(error);
      });

    Formation.find({ _id: saved._id }).exec((err, formation) =>
      res.json(formation)
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
