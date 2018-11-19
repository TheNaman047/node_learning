/**
 * Primary file for API
 * 
 */

// Dependancies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

var server = http.createServer(function (req, res) {

    // Get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query
    var queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    var method = req.method.toLowerCase();

    // Get the headers as object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = "";
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });

    req.on('end', function () {

        buffer += decoder.end();

        // Choose the handler to which request should go to. If handler not there then call notFound handler
        var choosenHandler = typeof (router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        // Route the request to the handler specified in the router
        choosenHandler(data, function (statusCode, payload) {

            // Use the status code 200 if callback by the handler does not have any
            statusCode = typeof (statusCode) === "number" ? statusCode : 200;

            // Use the payload returned by the handler or default it to empty object
            payload = typeof (payload) == "object" ? payload : {};

            // Convert the payload object to string
            var payloadString = JSON.stringify(payload);

            // Send the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Logging the payload
            console.log("Response payload sent is " + payloadString);
        });

        // Log the request path
        // console.log("Request received on path: " + trimmedPath + " with method: " + method + " with query: ", queryStringObject);
        // console.log("Request received with these headers : ", headers);
        // console.log("Request payload : ", buffer);
    });

});

// Start server
server.listen(config.port, function () {
    console.log("Current Environment: " + config.env);
    console.log("Server is listening on port " + config.port);
});

// Define the handlers
var handlers = {}

// Sample handler
handlers.sample = function (data, callback) {
    // Callback a http status code and response payload object
    callback(300, { 'sample': 'handler' });
};

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

// Define a request router
var router = {
    'sample': handlers.sample
}