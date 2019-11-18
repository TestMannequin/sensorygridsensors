const router = require("express").Router();
const sensorsController = require("../controllers/sensorsController");

// Matches with "/api/users"
router.route("/")
  .get(sensorsController.findAll)
  .get(sensorsController.findById)
  .post(sensorsController.create);

router.route("/values")
  .get(sensorsController.getValues);
  

module.exports = router;