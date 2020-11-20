const controller = require('../controllers/appointment.controller')

module.exports = function(app) {

app.post("/api/appointment/create", controller.createAppointment);
app.get("/api/appointment/all", controller.allAppointments);

}