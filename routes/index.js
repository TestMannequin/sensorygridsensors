const router = require("express").Router();
const sensorRoutes = require("./sensors");
const sensorReadingsRoutes = require("./sensorreadings");
const acUnitRoutes = require("./acunits");

router.use("/sensors", sensorRoutes);
router.use("/sensorreadings", sensorReadingsRoutes);
router.use("/acunits", acUnitRoutes);
module.exports = router;
