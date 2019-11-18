const router = require("express").Router();
const sensorReadingsController = require("../controllers/sensorReadingsController");

// Matches with "/api/users"
router.route("/")
  .get(sensorReadingsController.findAll)
  .post(sensorReadingsController.create);

module.exports = router;