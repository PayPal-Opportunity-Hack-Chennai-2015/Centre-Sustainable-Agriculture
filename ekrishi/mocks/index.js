/*global require:true, module:true*/
'use strict';

var express         = require("express"),
	app             = express(),
	config          = require('./ServiceConfig'),
	shush			= require('shush'),
	testConfig      = shush("../config/development").mochatestSetup,
	bodyParser      = require("body-parser"),
	errorHandler    = require("errorhandler"),
	caseManager    = require("./caseManager"),
	db              = {};

// Config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(errorHandler({dumpExceptions: true, showStack: true}));

Object.keys(config).forEach(function (serviceName) {
	if (config[serviceName].hasResponse === true) {
		db[serviceName] = require('./dummyData/' + serviceName);
	}

	app[config[serviceName].action](config[serviceName].endpoint,function(req, res){

		console.log(serviceName);

		if (db[serviceName]) {

			req.model = db[serviceName].cases ? caseManager(req, res, db[serviceName].cases) : db[serviceName];
			
			res.json(req.model);
		} else {
			res.send('');
		}

	});

	
});

//console.log(app.routes);

// Launch server
app.listen(testConfig.mocksPort);
console.log('MOCK SERVER RUNNING AT http://localhost:%s/', testConfig.mocksPort);

module.exports = app;