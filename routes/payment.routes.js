const controller = require("../controllers/payment.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.post("/create_payment_intent", [authJwt.verifyToken], controller.payment);
  app.get("/list_payments", [authJwt.verifyToken], controller.listPayement);
};
