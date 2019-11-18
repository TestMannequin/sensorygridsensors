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
    console.log(req.query)
    var filter = {};
    if(req.query.sensorId)
        filter.sensorId = req.query.sensorId;
    if(req.query.timestamp)
        filter.timestamp = req.query.timestamp;

    // you cannot know if the incoming 
    // price is for gt or lt, so

    // add new query variable price_gt (price greater than)
    if(req.query.timestamp_gt) {
        filter.timestamp = filter.timestamp || {};
        filter.timestamp.$gt = req.query.timestamp_gt;
    }

    // add new query variable price_lt (price less than)
    if(req.query.timestamp_lt) {
        filter.timestamp = filter.timestamp || {};
        filter.timestamp.$lt = req.query.timestamp_lt;
    }

    db.SensorReading
      .find(filter)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
    
  }
};
