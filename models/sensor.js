const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sensorSchema = new Schema({
  name: { type: String, required: true }
});

const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;
