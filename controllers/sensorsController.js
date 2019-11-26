const db = require("../models");
// Defining methods for the UsersController
module.exports = {
  findAll: function(req, res) {
    db.Sensor
      .find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Sensor
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Sensor
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Sensor
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Sensor
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  getValues: function(req,res){

    var filter = {};
    if(req.query.sensorId)
        filter.sensorId = req.query.sensorId;
    if(req.query.timestamp)
        filter.timestamp = req.query.timestamp;
    // you cannot know if the incoming 
    // timestamp is for gt or lt, so

    // add new query variable timestamp (timestamp greater than)
    if(req.query.timestamp_gt) {
        filter.timestamp = filter.timestamp || {};
        filter.timestamp.$gt = req.query.timestamp_gt;
    }

    // add new query variable timestamp (timestamp less than)
    if(req.query.timestamp_lt) {
        filter.timestamp = filter.timestamp || {};
        filter.timestamp.$lt = req.query.timestamp_lt;
    }

    //get the sensor name then do the query
    var sensorName = "unknown";
    db.Sensor.findOne({ '_id': req.query.sensorId }, 'name', function (err, sensor) {
      if (err) return handleError(err);
      sensorName =  sensor.name
       //get the sensor readings
      db.SensorReading
      .find(filter,'value timestamp')
      .sort({ date: -1 })
      .then(dbModel => res.json({sensorName: sensorName,sensorId:req.query.sensorId, values: dbModel}))
      .catch(err => res.status(422).json(err));
    });
    
  }
  
};
