// Import express and request modules
var express = require('express');
var request = require('request');
var dotenv = require('dotenv');

dotenv.config();

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;
const PORT = process.env.PORT;

var app = express();

app.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Example app listening on port " + PORT);
});

var facts = require('./facts.json');

//The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

app.get('/', function(req, res) {
    var factsLength = facts.length;
    var randomIndex = getRandomInt(0, factsLength);
    var randomFact = facts[randomIndex];

    res.send('Fact #' + (randomIndex + 1) + ': ' + randomFact);
});

app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
});

// Route the endpoint that our slash command will point to
app.post('/command', function(req, res) {
    var factsLength = facts.length;
    var randomIndex = getRandomInt(0, factsLength);
    var randomFact = facts[randomIndex];

    res.send({
        "response_type": "in_channel",
        "text": 'Disney Parks Fact #' + (randomIndex + 1) + ': ' + randomFact
    });
});
