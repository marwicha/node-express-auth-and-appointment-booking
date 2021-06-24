const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.put("/api/compte/:id", [authJwt.verifyToken], controller.update);

  app.get(
    "/api/compte/:id",
    [authJwt.verifyToken],
    controller.deleteUserAndAppointments
  );
};
