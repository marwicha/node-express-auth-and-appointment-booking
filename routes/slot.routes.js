const controller = require('../controllers/slot.controller')

module.exports = function(app) {

app.get("/api/slots/all", controller.allSlots);

}