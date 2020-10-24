const db = require("../models");
const Appointment = db.appointment;

exports.createAppointment = (req, res) => {
    
  const requestBody = req.body

   const newAppointment = new Appointment({
    date: requestBody.date,
    time: requestBody.time,
    prestation: requestBody.prestation,
    booked: true
  });

   newAppointment.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    res.status(200).send({  
        id: newAppointment._id,
        date: newAppointment.date,
        time: newAppointment.time,
        prestation: newAppointment.prestation,
        booked: newAppointment.booked 
      });
  })
}