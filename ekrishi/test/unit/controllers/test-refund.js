/*global describe:true, it:true, require:true, beforeEach:true, process:true, server:true, before:true, after:true */
'use strict';

var testConfig = require('../config/config').mochatestSetup,
	internalIp = process.env[testConfig.openshiftEnvVariable] || 'localhost',
	appPort = testConfig.appPort,
	rootURI = internalIp + ":" + appPort + "/",
	should = require('should'),
	app = require('../app'),
	superagent = require('superagent');


describe('Refund page routes testing', function() {
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

	it('should show messages view before refundConfirm view', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/messages/3JL3910102390602W/PP-000-000-710-094')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should display refundConfirm view', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/refundConfirm')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should submit refund successfully', function(done) {

		var params = {
			subsolution: 'fullRefund'
		};

		agent
			.post(rootURI + 'resolutioncenter/refundConfirm')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);

				// User will be redirected to refundComplete page for successful completion
				res.status.should.equal(200);
				done();
			});
	});

});