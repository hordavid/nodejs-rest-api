var express = require('express');
var fortune = require('fortune');
var nedb = require('fortune-nedb');
var jsonapi = require('fortune-json-api');

var server = express();
var store  = fortune({
    adapter: {
        type: nedb,
        options: {
          dbPath: __dirname + '/.db'
        }
    },
    serializers: [{
        type: jsonapi
    }]
});

server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

server.use(function (req, res, next) {
    console.log(req.method + ' ' + req.url);
    next();
});

store.defineType('employee', {
    firstname: {type: String},
    lastname: {type: String},
    job: {type: String},
    email: {type: String},
    phone: {type: String},
    times: {
        link: "time",
        isArray: true
    }
});

store.defineType('time', {
    owner: {type: String},
    project: {type: String},
    date: {type: String},
    begin: {type: String},
    end: {type: String},
    absenceTime: {type: Number}
});

server.use(fortune.net.http(store));

var port = process.env.PORT || 8080;

store.connect().then(function () {
    server.listen(port, function () {
        console.log('Server started on port ' + port);
    });
});

/*
{
    "data": {
        "type": "employee",
        "attributes": {
            "firstname": "Horváth",
            "lastname": "Dávid",
            "job": "Fejlesztő",
            "email": "david@horvath.com",
            "phone": "06/30/11-22-333"
        }
    }
}
*/