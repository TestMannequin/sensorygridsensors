const router = require("express").Router();

const sensorReadingsRoutes = require("./sensorreadings");
router.use("/sensorreadings", sensorReadingsRoutes);

module.exports = router;
