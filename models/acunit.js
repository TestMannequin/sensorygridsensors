const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const acUnitSchema = new Schema({
  name: { type: String, required: true },
  modelNumber: String, //AHRI model number
  brandName: String,
  coolingCapacity : Number,    
  ahriType: String,
  inletSensorId: String,
  outletSensorId: String,
  electricityUsageId: String,
  onOffStatusId: String,
  dailyHealthStatusId: String,

});

const ACUnit = mongoose.model("ACUnit", acUnitSchema);

module.exports = ACUnit;
