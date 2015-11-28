/*global describe:true, it:true, require:true, beforeEach:true, process:true, server:true, before:true, after:true */
'use strict';

var testConfig = require('../config/config').mochatestSetup,
	internalIp = process.env[testConfig.openshiftEnvVariable] || 'localhost',
	appPort = testConfig.appPort,
	rootURI = internalIp + ":" + appPort + "/",
	should = require('should'),
	app = require('../app'),
	superagent = require('superagent');


describe('Resolve page routes testing', function() {
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

	it('should show messages view before escalate view', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/messages/3JL3910102390602W/PP-000-000-710-094')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should redirect to message view if user paste and hit url of escalate view', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/resolve/3JL3910102390602W/PP-000-000-710-094')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should user resolve the dispute successfully', function(done) {
		var params = {
			txnId: '3JL3910102390602W',
			caseId: 'PP-000-000-710-094'
		};

		agent
			.post(rootURI + 'resolutioncenter/resolve')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);

				// User will be redirected to message page with confirmation message for successful completion
				res.status.should.equal(200);
				done();
			});
	});

});