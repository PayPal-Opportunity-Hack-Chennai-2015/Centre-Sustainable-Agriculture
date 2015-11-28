/*global describe:true, it:true, require:true, beforeEach:true, process:true, server:true, before:true, after:true */
'use strict';

var testConfig = require('../config/config').mochatestSetup,
	internalIp = process.env[testConfig.openshiftEnvVariable] || 'localhost',
	appPort = testConfig.appPort,
	rootURI = internalIp + ":" + appPort + "/",
	should = require('should'),
	app = require('../app'),
	superagent = require('superagent');


describe('Application initial page route testing', function() {
	var agent = superagent.agent(),
		server;

	before(function(done) {

		server = app.listen(appPort, function(err) {
			if (err) {
				console.error(err.message);
				app.emit('shutdown', server, 1000);
			} else {
				console.log('[%s] Listening on http://localhost:%d', app.settings.env.toUpperCase(), appPort);
			}
			setTimeout(function() {
				done();
			}, 100);
		});

	});

	after(function(next) {
		server.close(function() {
			console.log("server closed!");
			next();
		});
	});


	it('should display resolution center dashboard page', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/')
			.end(function(err, res) {
				should.not.exist(err);
				
				// will be redirected to legacy rescenter dashboard page
				res.status.should.equal(404);
				done();
			});
	});

});