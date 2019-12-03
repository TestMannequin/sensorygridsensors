const axios = require('axios')
const dotenv = require('dotenv').config();

const influxurl = process.env.INFLUX_URI;
const parse = require('csv-parse')
module.exports = {

    findAll: function(req, res) {
        // add new query variable timestamp (timestamp greater than)
        var start = '-1h';
        if(req.query.start) start = req.query.start;
        
        var stop = '-1s';
        if(req.query.stop) start = req.query.stop;

        var ACUnit = 1;
        if(req.query.ACUnit) ACUnit = req.query.ACUnit;

        var userId = 'notset';
        if(req.query.userId) userId = req.query.userId;
        else
        { 
            res.status(422).json({"error": 'A userId must be specified'});
            return;
        }
        var measurementType = 'Sensors';
        if(req.query.type) measurementType = req.query.type;

        var query = `from(bucket: "SensoryGrid")
        |> range(start: ${ start }, stop: ${ stop })
        |> filter(fn: (r) => r._measurement == "${ measurementType }")
        |> filter(fn: (r) => r._field == "temperature" or r._field == "usage_kWh")    
        |> filter(fn: (r) => r.userId == "${ userId }")`;

        if(measurementType==='Sensors')
             query = query + ` |> filter(fn: (r) => r.topic == "sensors/Inlet${ ACUnit }" or r.topic == "sensors/Outlet${ ACUnit }")`
        //  |> filter(fn: (r) => r.topic == "sensors/Inlet1" or r.topic == "sensors/Outlet1")
        axios.post(influxurl, query,{headers: {
            'Authorization': process.env.INFLUX_TOKEN,
            'Content-Type': 'application/vnd.flux',
            'Accept' : 'application/csv'               
          }})
          .then((influxresult) => {
            //parse the influx CSV format into the Apex charts series format
            const output = []
            parse(influxresult.data, {
              trim: true,
              skip_empty_lines: true
            })
            .on('readable', function(){
              let record
              while (record = this.read()) {
                //console.log(record)  
                timestamp = new Date(record[5]).getTime()
                if(timestamp)//if the timestamp is null, not a value to send
                {
                    var timevalpair=[timestamp,record[6]]
                    var topic = record[7] //record[7] is the field name
                    if(record[9].includes("sensors"))
                        topic=record[9]+'_'+ record[7]//record[9] is the topic, only need this if it is a sensor
                        
                    const foundseries = output.find(element => element.name ==topic);
                    if (foundseries) 
                    {
                        foundseries['data'].push(timevalpair);
                    }
                    else
                    {
                        newseries = {
                            'name': topic,
                            'data' : [timevalpair]
                        };
                        output.push(newseries)
                    }
                }
              }
            })
            .on('end', function(){
             //console.log(output);
             res.json(output)
            })
            
                
          })
          .catch((error) => {
            console.error(error)
          })
    },
    
    //find the seven day energy trend for a user
    sevenDayEnergyTrend: function(req,res)
    {
        var userId = 'notset';
        if(req.query.userId) userId = req.query.userId;
        else
        { 
            res.status(422).json({"error": 'A userId must be specified'});
            return;
        }
        var measurementType = 'Energy';

        var query = `from(bucket: "SensoryGrid")
        |> range(start: -16d, stop: -4d) 
        |> filter(fn: (r) => r._measurement == "${ measurementType }")
        |> filter(fn: (r) => r._field == "usage_kWh")
        |> filter(fn: (r) => r.userId == "${ userId }")
        |> aggregateWindow(every: 7d, fn: sum)
        |> yield(name: "sum")`;

        axios.post(influxurl, query,{headers: {
            'Authorization': process.env.INFLUX_TOKEN,
            'Content-Type': 'application/vnd.flux',
            'Accept' : 'application/csv'               
          }})
          .then((influxresult) => {
            //parse the influx CSV format into the Apex charts series format
            const output = []
            parse(influxresult.data, {
              trim: true,
              skip_empty_lines: true
            })
            .on('readable', function(){
              let record
              while (record = this.read()) {
                //console.log(record)  
                timestamp = new Date(record[10]).getTime()
                if(timestamp)//if the timestamp is null, not a value to send
                {
                    var timevalpair=[timestamp,record[9]]
                    var topic = record[5] 
                        
                    const foundseries = output.find(element => element.name ==topic);
                    if (foundseries) 
                    {
                        foundseries['data'].push(timevalpair);
                    }
                    else
                    {
                        newseries = {
                            'name': topic,
                            'data' : [timevalpair]
                        };
                        output.push(newseries)
                    }
                }
              }
            })
            .on('end', function(){
             //console.log(output);
                res.json(output)
            })
            
                
          })
          .catch((error) => {
            console.error(error)
          })
    },

    //find the seven day energy trend for a user
    ACUnitMetrics: function(req,res)
    {
        var userId = 'notset';
        if(req.query.userId) userId = req.query.userId;
        else
        { 
            res.status(422).json({"error": 'A userId must be specified'});
            return;
        }
        var measurementType = 'Energy';
        
        var ACUnit = 1;
        if(req.query.ACUnit) ACUnit = req.query.ACUnit; //a user can have multiple AC units

        var query = `from(bucket: "SensoryGrid")
        |> range(start: -10d, stop: -3d) 
        |> filter(fn: (r) => r._measurement == "${ measurementType }")
        |> filter(fn: (r) => r._field == "usage_kWh")
        |> filter(fn: (r) => r.userId == "${ userId }")
        |> sum()`;

        axios.post(influxurl, query,{headers: {
            'Authorization': process.env.INFLUX_TOKEN,
            'Content-Type': 'application/vnd.flux',
            'Accept' : 'application/csv'               
          }})
          .then((influxresult) => {
            //parse the influx CSV format into the Apex charts series format
            const output = []
            parse(influxresult.data, {
              trim: true,
              skip_empty_lines: true
            })
            .on('readable', function(){
              let record
              while (record = this.read()) {
                console.log(record)  
                timestamp = new Date(record[4]).getTime()
                if(timestamp)//if the timestamp is null, not a value to send
                {
                    var value = record[9];
                    adjustment = 50;
                    if(ACUnit===2)
                        adjustment =100;
                    value = (value-adjustment)/2;//this is a very crude estimate as to the AC usage, this will become more sophisticated based on sensors and weather
                    
                    var timevalpair=[timestamp,value]
                    var topic = "AC Unit 7d Usage (kWh)"
                        
                    const foundseries = output.find(element => element.name ==topic);
                    if (foundseries) 
                    {
                        foundseries['data'].push(timevalpair);
                    }
                    else
                    {
                        newseries = {
                            'name': topic,
                            'data' : [timevalpair],
                            'Efficiency' : Math.random() < 0.5 ? 'Good' : 'Poor', //this will be caculated
                            'ACUnit': ACUnit
                        };
                        output.push(newseries)
                    }
                }
              }
            })
            .on('end', function(){
             //console.log(output);
                res.json(output)
            })
            
                
          })
          .catch((error) => {
            console.error(error)
          })
    }
  };
  