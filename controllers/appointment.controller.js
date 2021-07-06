const db = require("../models");
const Appointment = db.appointment;
const Slot = db.slot;
const User = db.user;

require("dotenv").config();
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

//Templates from sendGrid account
const templates = {
  rendezvousConfirmed: "d-07dd92f729b6434794bb3ed6cfff85e0",
  rendezvousCancelled: "d-e1ba2bd0352f4c62a860a5a54bf2723c",
};

const emailPatrick = "marwa.rekik.pro@gmail.com";

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
  const user = await User.findById(req.user.id);

  const msgRVConfirmed = {
    from: `Equipe IKDO <${emailPatrick}>`,
    templateId: templates.rendezvousConfirmed,
    personalizations: [
      {
        to: [{ email: user.email }],
      },
    ],
  };

  const newSlot = new Slot({
    slot_time: requestBody.slot_time,
    slot_date: requestBody.slot_date,
    created_at: Date.now(),
    user: user.id,
  });

  await newSlot.save();

  const newAppointment = new Appointment({
    prestation: requestBody.prestation,
    slots: newSlot._id,
    user: user.id,
    annule: false,
  });

  newAppointment.save((err, saved) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    sendGridMail
      .send(msgRVConfirmed)
      .then((res) => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.log(error);
      });

    Appointment.find({ _id: saved._id })
      .populate("slots")
      .exec((err, appointment) => res.json(appointment));
  });
};

exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les informations à mettre à jour ne peuvent pas être vides!",
    });
  }

  const appointment = await Appointment.findById(req.params.id);

  const user = await User.findById(appointment.user._id);

  const msgRVCancelled = {
    from: `Equipe IKDO <${emailPatrick}>`,
    templateId: templates.rendezvousCancelled,
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

// exports.delete = async (req, res) => {
//   const emailPatrick = "marwa.rekik.pro@gmail.com";

//   const appointment = await Appointment.findById(req.params.id);

//   const slot = await Slot.findById(appointment.slots);

//   await Slot.findOneAndDelete({ _id: slot._id });

//   await Appointment.findOneAndDelete({ _id: req.params.id });

//   const user = await User.findById(appointment.user);

//   const msgRVCancelled = {
//     from: `Equipe IKDO <${emailPatrick}>`,
//     templateId: templates.rendezvousCancelled,
//     personalizations: [
//       {
//         to: [{ email: user.email }],
//       },
//     ],
//   };

//   sendGridMail
//     .send(msgRVCancelled)
//     .then((res) => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   res.send({
//     message: "Votre rendez vous est annulé avec succès!",
//   });
// };
