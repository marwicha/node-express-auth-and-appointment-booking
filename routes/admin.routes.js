const controller = require("../controllers/admin.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.get("/api/getAll", [authJwt.verifyToken], controller.allAppointmentsAdmin);

  app.post(
    "/api/formation/create",
    [authJwt.verifyToken],
    controller.addFormation
  );

  app.get(
    "/api/formation/all",
    [authJwt.verifyToken],
    controller.allFormations
  );

  app.put(
    "/api/formation/update/:id",
    [authJwt.verifyToken],
    controller.updateFormation
  );

  app.delete(
    "/api/formation/delete/:id",
    [authJwt.verifyToken],
    controller.delete
  );
};
