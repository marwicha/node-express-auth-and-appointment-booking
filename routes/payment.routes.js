const controller = require("../controllers/payment.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.post("/api/payment", [authJwt.verifyToken], controller.payment);
};
