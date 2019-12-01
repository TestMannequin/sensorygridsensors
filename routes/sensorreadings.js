const router = require("express").Router();
const influxDataController = require("../controllers/influxDataController");

router.route("/")
  .get(influxDataController.findAll);

router.route("/EnergyTrend")
  .get(influxDataController.sevenDayEnergyTrend);

  
router.route("/ACUnitMetrics")
.get(influxDataController.ACUnitMetrics);

module.exports = router;