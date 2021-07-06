const controller = require("../controllers/admin.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.get(
    "/api/getAll",
    [authJwt.verifyToken],
    controller.allAppointmentsAdmin
  );
};
