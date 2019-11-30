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

        var user = 'notset';
        if(req.query.user) user = req.query.user;
        else res.status(422).json({"error": 'A user email must be specified'});


        // add new query variable timestamp (timestamp less than)
        if(req.query.timestamp_lt) {
            filter.timestamp = filter.timestamp || {};
            filter.timestamp.$lt = req.query.timestamp_lt;
        }

        var query = `from(bucket: "SensoryGrid")
        |> range(start: ${ start }, stop: ${ stop })
        |> filter(fn: (r) => r._measurement == "Temperatures")
        |> filter(fn: (r) => r._field == "temperature")      
        |> filter(fn: (r) => r.user == "${ user }")`;
        //  |> filter(fn: (r) => r.topic == "sensors/Inlet1" or r.topic == "sensors/Outlet1")
        axios.post(influxurl, query,{headers: {
            'Authorization': process.env.INFLUX_TOKEN,
            'Content-Type': 'application/vnd.flux',
            'Accept' : 'application/csv'               
          }})
          .then((influxresult) => {
            console.log(`statusCode: ${influxresult.status}`)
            //console.log(influxresult)
            

            //parse the influx CSV format into the Apex charts series format
            const output = []
            parse(influxresult.data, {
              trim: true,
              skip_empty_lines: true
            })
            .on('readable', function(){
              let record
              while (record = this.read()) {
                timestamp = new Date(record[5]).getTime()
                if(timestamp)//if the timestamp is null, not a value to send
                {
                    var timevalpair=[timestamp,record[6]]
                    var topic = record[9]
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
    }
      
  };
  