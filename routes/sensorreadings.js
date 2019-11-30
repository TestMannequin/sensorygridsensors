const router = require("express").Router();
const influxDataController = require("../controllers/influxDataController");

router.route("/")
  .get(influxDataController.findAll);

module.exports = router;