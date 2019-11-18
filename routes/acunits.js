const router = require("express").Router();
const acUnitsController = require("../controllers/acUnitsController");

// Matches with "/api/users"
router.route("/")
  .get(acUnitsController.findAll)
  .get(acUnitsController.findById)
  .post(acUnitsController.create)
  .patch(acUnitsController.update);



module.exports = router;