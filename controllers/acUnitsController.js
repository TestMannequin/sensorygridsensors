const db = require("../models");
const sensorsController = require('./sensorsController');
// Defining methods for the UsersController
module.exports = {
  findAll: function(req, res) {
    db.ACUnit
      .find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.ACUnit
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.ACUnit
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.ACUnit
      .findOneAndUpdate( req.params.id , req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.ACUnit
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  getLatestValues: function(req, res) {
    db.ACUnit
        .find(req.params)
        .then(dbModel => {
            console.log("looking for sensor with Id " +  dbModel[0].acHealthId);
            //res.json(dbModel);
            newreq = req
            newreq.params ={sensorId :  dbModel[0].acHealthId}
            console.log(newreq);
            sensorsController.getMultipleSensorValues(newreq,res);
        })
        .catch(err => res.status(422).json(err));
  }  
};
