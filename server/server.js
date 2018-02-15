/***************************************************
 *              SERVER STUFF
 **************************************************/

let express = require('express'),
    spawn = require('child_process').spawn,
    config = require('config'),
    logger = require('morgan'),
    app = express(),
    neoClass = require('./neo.js');

template = require('pug').compileFile(__dirname + '/src/docs/api-docs/templates/base.pug');

const path = require('path');
const bodyParser = require('body-parser');

let neoObj = new neoClass();

app.use(logger('dev'));
app.use(bodyParser.json);

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
    metricTypes = config.get('metricTypes');

    // Find the metric requested
    metric = metricTypes.find(function (m) {
        return m["alias"] === req.params.metricName;
    });

    // If there is no metric found then send res now.
    if (metric === undefined) {
        res.send({"success": false, "msg": "no metric found"})
    } else { // Else start the metric job
        console.log("Running:", metric["alias"], " with filename:", metric["fileName"]);

        // Get the location
        loc = config.get('metricDir') + "/" + metric["fileName"];

        // Spawn the child process to run the metric
        const pyTest = spawn('python', [loc]);

        body = '';

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
            result = {"sucess": true, "results": body};

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
app.get('/api/getType/:type', (req, res) => {

});

/*
 * Returns all packets for a specific type
 */
app.get('/api/getTypePackets/:type', (req, res) => {

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
    neoObj.getDeviceById(decodeURIComponent(req.params.id)).then((data) => {
        res.jsonp(data);
    }).catch((err) => {
        res.jsonp(err)
    });
});

// TODO: Not working >.>
app.post('/api/pcap/addDevice',(req,res)=>{
    console.log("posting: ", req.body);
   neoObj.saveDevice(req.body).then((result)=>{
       res.jsonp(result)
   }).catch((err)=>{
       res.jsonp(err)
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