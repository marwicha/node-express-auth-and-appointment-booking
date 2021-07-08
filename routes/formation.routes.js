const controller = require("../controllers/formation.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.post(
    "/api/admin/formation/create",
    [authJwt.verifyToken],
    controller.addFormation
  );

  app.get(
    "/api/admin/formation/all",
    [authJwt.verifyToken],
    controller.allFormations
  );

  app.delete(
    "/api/admin/formation/delete/:id",
    [authJwt.verifyToken],
    controller.delete
  );
};
