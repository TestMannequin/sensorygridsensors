const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sensorReadingSchema = new Schema({
  sensorId: { type: String, required: true },
  value : { type: Number, required: true },
  timestamp : { type: Date, required: true }
});

const SensorReading = mongoose.model("SensorReading", sensorReadingSchema);

module.exports = SensorReading;
