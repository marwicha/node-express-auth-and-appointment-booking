const controller = require('../controllers/appointment.controller')
const { authJwt } = require("../middlewares");

module.exports = function(app) {

app.post("/api/appointment/create", [authJwt.verifyToken], controller.createAppointment);
app.get("/api/appointment/all", controller.allAppointments);
app.get("/api/appointment/:id", [authJwt.verifyToken], controller.getUserAppointments);

}