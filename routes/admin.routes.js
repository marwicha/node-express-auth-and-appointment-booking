const controller = require("../controllers/admin.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.get(
    "/api/admin/appointment/getAll",
    [authJwt.verifyToken],
    controller.allAppointmentsAdmin
  );

  app.put(
    "api/admin/appointment/cancel/:id",
    [authJwt.verifyToken],
    controller.cancelAppointmentByAdmin
  );
};
