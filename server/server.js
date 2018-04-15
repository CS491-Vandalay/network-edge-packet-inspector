/***************************************************
 *              SERVER STUFF
 **************************************************/

let express = require('express'),
    spawn = require('child_process').spawn,
    config = require('config'),
    logger = require('morgan'),
    app = express(),
    neoClass = require('./neo.js'),
    bodyParser = require('body-parser'),
    cors = require('cors');

template = require('pug').compileFile(__dirname + '/src/docs/api-docs/templates/base.pug');

const path = require('path');

let neoObj = new neoClass();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());

let server = app.listen(8090, () => {
    console.log("Server listening on port 8090");
});

/***************************************************
 *              METRIC ROUTES
 **************************************************/

/**
 * This function starts a python process to perform
 * the metric analysis specified. The following json
 * structure will be returned:
 *
 * { "success": true,
 *   "results": {output}
 * }
 *
 */
app.get('/api/doMetric/:metricName', (req, res) => {

    // Get all the metrics
    let metricTypes = config.get('metricTypes');

    // Find the metric requested
    let metric = metricTypes.find(function (m) {
        return m["alias"] === req.params.metricName;
    });

    // If there is no metric found then send res now.
    if (metric === undefined) {
        res.send({"success": false, "msg": "no metric found"})
    } else { // Else start the metric job
        console.log("Running:", metric["alias"], " with filename:", metric["fileName"]);

        // Get the location
        let loc = config.get('metricDir') + "/" + metric["fileName"];

        // Spawn the child process to run the metric
        const pyTest = spawn('python', [loc]);

        let body = '';

        // put all of stdout into body
        pyTest.stdout.on('data', (data) => {
            body += data.toString()
        });

        // log any err's to console
        pyTest.stderr.on('data', (data) => {
            console.log(data.toString())
        });

        // when child process is done log the exit code
        // and send the results to the browser
        pyTest.on('close', (code) => {
            console.log("Exit Code:", code.toString());

            // Convert string body to json body
            body = JSON.parse(body.split("'").join("\""));

            // wrap the results in a json
            result = {"success": true, "results": body};

            // send the response
            res.end(JSON.stringify(result));
        });
    }
});

/*
 * This route returns all the metrics located in
 * the default config with the following json
 * structure:
 *
 * { "success": true,
 *   "results":[
 *      {
 *          "alias":"typeOne",
 *          "fileName":"pyTest.py"
 *       },
 *      {
 *          "alias":"typeTwo",
 *          "fileName":"pyTest2.py"
 *       }
 *   ]
 * }
 */
app.get('/api/getMetricTypes', (req, res) => {

    // Get the metrics
    metricTypes = config.get('metricTypes');

    if (metricTypes === undefined) {
        res.send({"success": true, "msg": "no metrics found"})
    } else {

        // make a return obj
        metrics = {"results": []};

        // put the metric types there
        metrics["results"] = metricTypes;

        // send the metrics
        res.send(metrics)
    }
});

app.get('/api/getMetric/:metricName', (req, res) => {
    //TODO: Write this
});

/***************************************************
 *              PCAP ROUTES
 **************************************************/

// TODO: Write the routes
app.get('/api/test', (req, res) => {

    sCallback = (data) => {
        body = [];
        data["records"].forEach((record) => {
            body.push(record.get("n.name"));
        });
        res.send({"success": true, "results": body});
    };

    fCallback = (err) => {
        console.log("Error: ", err);
        res.send({"success": false, "results": err})
    };

    neoObj.readTest(sCallback, fCallback)
});

/************************************************************
 *              PCAP TYPES
 ***********************************************************/

/**
 * This function retrieves all the defined Types in
 * the neo4j database associated with this server.
 * The return is of the following format:
 *
 * { "success": true,
 *   "results": {
 *      [
 *          {"id":0,"type":"media"
 *      ]
 *   }
 * }
 *
 */
app.get('/api/pcap/getTypes', (req, res) => {
    neoObj.getTypes().then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err)
    });
});

/*
 * Returns a specific type
 */
app.get('/api/pcap/getTypeByName/:name', (req, res) => {
    neoObj.getTypeByName(decodeURIComponent(req.params.name)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err)
    });
});

app.get('/api/pcap/getTypeById/:id', (req, res) => {
    neoObj.getTypeById(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err)
    });
});

/*
 * Returns all packets for a specific type
 */
app.get('/api/getTypePackets/:type', (req, res) => {

});

app.get('/api/pcap/getDeviceCount', (req, res) => {
    neoObj.getNumOfTypes().then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getTypeCountForDevice/:id',(req,res)=>{
    neoObj.getNumTypesPerDevice(parseInt(req.params.id)).then((data)=>{
        res.jsonp(data);
    }).catch((err)=>{
        console.log(err);
        res.jsonp(err);
    })
});

app.get('/api/pcap/getPacketsByType/:id', (req, res) => {
    neoObj.getPacketsByType().then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

/************************************************************
 *              PCAP DEVICES
 ***********************************************************/
app.get('/api/pcap/getDevices', (req, res) => {
    neoObj.getAllDevices().then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err)
    });
});

app.get('/api/pcap/getDeviceByName/:name', (req, res) => {
    neoObj.getDeviceByName(decodeURIComponent(req.params.name)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err)
    });
});

app.get('/api/pcap/getDeviceByIp/:ip', (req, res) => {
    neoObj.getDeviceByIp(decodeURIComponent(req.params.ip)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err)
    });
});

app.get('/api/pcap/getDeviceById/:id', (req, res) => {
    neoObj.getDeviceById(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    });
});

app.get('/api/pcap/getDeviceLocation/:id', (req, res) => {
    neoObj.getDeviceLocation(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    });
});

app.get('/api/pcap/getDevicesWithLocation/:id', (req, res) => {
    neoObj.getDevicesWithLocation(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.post('/api/pcap/addDevice', (req, res) => {
    neoObj.saveDevice(req.body).then((result) => {
        res.jsonp(result);
    }).catch((err) => {
        res.jsonp(err);
    });
});

app.post('/api/pcap/deleteDevice', (req, res) => {
    if (req.body["id"]) {
        console.log("here");
        neoObj.deleteDevice(req.body["id"]).then((result) => {
            res.jsonp(result);
        }).catch((err) => {
            res.jsonp(err);
        });
    } else {
        err = new Error("id is required to delete a device");
        res.jsonp({"success": false, "msg": "id is required", "err": err})
    }
});

app.get('/api/pcap/getDeviceCount', (req, res) => {
    neoObj.getNumOfDevices().then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getPacketsFromDevice/:id', (req, res) => {
    neoObj.getPacketsFromDevice(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getPacketsToDevice/:id', (req, res) => {
    neoObj.getPacketsToDevice(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getDeviceByPacket/:id', (req, res) => {
    neoObj.getDevicesForPacketId(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getDestinationDeviceForPacket/:id', (req, res) => {
    neoObj.getDestinationDeviceForPacket(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});


/************************************************************
 *              PCAP LOCATIONS
 ***********************************************************/
app.get('/api/pcap/getLocations', (req, res) => {
    neoObj.getLocations().then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    });
});

app.get('/api/pcap/getLocationByCountry/:country', (req, res) => {
    neoObj.getLocationByCountry(req.params.country).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getLocationById/:id', (req, res) => {
    neoObj.getLocationById(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getDeviceCount/locationId/:id', (req, res) => {
    neoObj.getNumDeviceFromLocationId(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getDeviceCount/locationCountry/:country', (req, res) => {
    neoObj.getNumDeviceFromLocationCountry(req.params.country).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getLocationCount', (req, res) => {
    neoObj.getNumOfLocations().then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getDestinationOfPacket/:id', (req, res) => {
    neoObj.getDestinationLocationOfPacket(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getSourceOfPacket/:id', (req, res) => {
    neoObj.getSourceLocationOfPacket(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getTypeCountForLocation/:id',(req,res)=>{
    neoObj.getNumTypesForLocation(parseInt(req.params.id)).then((data)=>{
        res.jsonp(data);
    }).catch((err)=>{
        console.log(err);
        res.jsonp(err);
    })
});

/************************************************************
 *              PCAP PACKETS
 ***********************************************************/

app.get('/api/pcap/getPackets', (req, res) => {
    neoObj.getPackets().then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err)
    });
});

app.get('/api/pcap/getPacketBySourceIp/:ip', (req, res) => {
    neoObj.getPacketsBySourceIp(decodeURIComponent(req.params.ip)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getPacketByDestinationIp/:ip', (req, res) => {
    neoObj.getPacketsByDestinationIp(decodeURIComponent(req.body.ip)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getPacketByPort/:port', (req, res) => {
    neoObj.getPacketsByPort(decodeURIComponent(req.body.port)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getPacketType/:id', (req, res) => {
    neoObj.getPacketType(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.post('/api/pcap/savePacket', (req, res) => {
    neoObj.savePacket(req.body).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.post('/api/pcap/savePacketsBulk', (req, res) => {
    neoObj.savePacketBulk(req.body["packets"]).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.post('/apip/pcap/deletePacket', (req, res) => {
    neoObj.deletePacket(req.body["id"]).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.post('/api/pcap/deletePacketBySourceIp', (req, res) => {
    neoObj.deletePacketBySourceIp(req.body["sourceIp"]).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.post('/api/pcap/deletePacketByDestinationIp', (req, res) => {
    neoObj.deletePacketByDestinationIp(req.body["destinationIp"]).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.post('/api/pcap/deletePacketByPort', (req, res) => {
    neoObj.deletePacketByPort(req.body["port"]).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getPacketCount', (req, res) => {
    neoObj.getNumOfPackets().then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getNumPacketsTypeToLocation/:tid/:lid', (req, res) => {
    neoObj.getNumOfPacketsTypeToLocation(req.params.tid, req.params.lid).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getPacketsFromLocation/:id', (req, res) => {
    neoObj.getPacketsFromLocation(parseInt(req.params.id), req.params.lid).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getPacketsToLocation/:id', (req, res) => {
    neoObj.getPacketsToLocation(parseInt(req.params.id), req.params.lid).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.get('/api/pcap/getPacketSourceLocation/:id', (req, res) => {
    neoObj.getSourceLocationOfPacket(parseInt(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

/************************************************************
 *              API DOCS
 ***********************************************************/

app.use(express.static(path.join(__dirname + "/src/docs/static")));

app.get('/docs/api', (req, res) => {
    try {
        console.log(path.join(__dirname + '/src/docs/api-docs'));
        let html = template({title: 'Home'});
        res.send(html);
    } catch (e) {
        console.log(e);
    }
});

app.use('/docs/api/node_modules', express.static(path.join(__dirname, '/node_modules')));

/***************************************************
 *              PCAP RELATIONSHIPS
 **************************************************/

app.post('/api/pcap/createComingFrom', (req, res) => {
    neoObj.createComingFrom(req.body["packetId"], req.body["deviceId"]).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.post('/api/pcap/createGoingTo', (req, res) => {
    neoObj.createGoingTo(req.body["packetId"], req.body["deviceId"]).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.post('/api/pcap/createTypeOf', (req, res) => {
    neoObj.createTypeOf(req.body["packetId"], req.body["typeId"]).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

app.post('/api/pcap/createLocatedIn', (req, res) => {
    neoObj.createLocatedIn(req.body["deviceId"], req.body["locationId"]).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err);
    })
});

/***************************************************
 *              PCAP SAVE
 **************************************************/
app.post('/api/pcap/save',(req,res)=>{
   neoObj.savePcapFile(req.body).then((data)=>{
       res.jsonp(data);
   }).catch((err)=>{
       console.log(err);
       res.jsonp(err);
   })
});

/***************************************************
 *              EXIT HANDLERS
 **************************************************/

process.on('exit', (code) => {
    neoObj.free();
    process.exit(code);
});

process.on('SIGINT', () => {
    neoObj.free();
    process.exit(0);
});

process.on('SIGTERM', () => {
    neoObj.free();
    process.exit(0);
});

process.on('uncaughtException', function (exception) {
    console.log(exception);
    process.exit(0);
});