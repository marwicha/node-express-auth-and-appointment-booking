const controller = require("../controllers/prestation.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.post(
    "/api/prestation/create",
    [authJwt.verifyToken],
    controller.createPrestation
  );

  app.get(
    "/api/prestation/all",
    [authJwt.verifyToken],
    controller.allPrestations
  );

  app.put(
    "/api/prestation/update/:id",
    [authJwt.verifyToken],
    controller.updatePrestation
  );

  app.delete(
    "/api/prestation/delete/:id",
    [authJwt.verifyToken],
    controller.delete
  );
};
