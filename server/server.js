/***************************************************
 *              SERVER STUFF
 **************************************************/

var express = require('express'),
    spawn = require('child_process').spawn,
    config = require('config'),
    logger = require('morgan'),
    app = express(),
    template = require('pug').compileFile(__dirname + '/src/docs/api-docs/templates/base.pug');

const path = require('path');

app.use(logger('dev'));

var server = app.listen(8090, function () {
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
app.get('/api/doMetric/:metricName', function (req, res) {

    // Get all the metrics
    metricTypes = config.get('metricTypes');

    // Find the metric requested
    metric = metricTypes.find(function(m){
        return m["alias"] === req.params.metricName;
    });

    // If there is no metric found then send res now.
    if(metric === undefined){
        res.send({"success":false,"msg":"no metric found"})
    } else { // Else start the metric job
        console.log("Running:", metric["alias"], " with filename:", metric["fileName"]);

        // Get the location
        loc = config.get('metricDir') + "/" + metric["fileName"];

        // Spawn the child process to run the metric
        const pyTest = spawn('python', [loc]);

        body = '';

        // put all of stdout into body
        pyTest.stdout.on('data', function (data) {
            body += data.toString()
        });

        // log any err's to console
        pyTest.stderr.on('data', function (data) {
            console.log(data.toString())
        });

        // when child process is done log the exit code
        // and send the results to the browser
        pyTest.on('close', function (code) {
            console.log("Exit Code:", code.toString());

            // Convert string body to json body
            body = JSON.parse(body.split("'").join("\""));

            // wrap the results in a json
            result = {"sucess":true,"results": body};

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
app.get('/api/getMetricTypes',function(req,res){

    // Get the metrics
    metricTypes = config.get('metricTypes');

    if(metricTypes === undefined){
        res.send({"success":true,"msg":"no metrics found"})
    } else {

        // make a return obj
        metrics = {"results": []};

        // put the metric types there
        metrics["results"] = metricTypes;

        // send the metrics
        res.send(metrics)
    }
});

/***************************************************
 *              PCAP ROUTES
 **************************************************/

// TODO: Write the routes

/***************************************************
 *              API DOCS
 **************************************************/

app.use(express.static(path.join(__dirname + "/src/docs/static")));

app.get('/docs/api', function (req, res) {
    try {
        console.log(path.join(__dirname + '/src/docs/api-docs'));
        var html = template({title: 'Home'});
        res.send(html);
    } catch (e) {
        console.log(e);
    }
});

app.use('/docs/api/node_modules', express.static(path.join(__dirname, '/node_modules')));
