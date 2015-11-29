/*global describe:true, it:true, require:true, beforeEach:true, process:true, server:true, before:true, after:true */
'use strict';

var testConfig = require('../config/config').mochatestSetup,
	internalIp = process.env[testConfig.openshiftEnvVariable] || 'localhost',
	appPort = testConfig.appPort,
	rootURI = internalIp + ":" + appPort + "/",
	should = require('should'),
	app = require('../app'),
	superagent = require('superagent');


describe('Escalate page routes testing', function() {
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

	it('should redirect to message view if user paste and hit url of escalate view', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/escalate/4JL3910102390602W/PP-000-000-710-094')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
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

	it('should display escalate view', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/escalate/3JL3910102390602W/PP-000-000-710-094')
			.end(function(err, res) {				
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should user escalate to PayPal', function(done) {

		var params = {
			escalate_reason: 'disputeProcessFailed',
			message_body: 'seller did not respond'
		};

		agent
			.post(rootURI + 'resolutioncenter/escalate')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {				
				should.not.exist(err);

				// User will be redirected to legacy rescenter for successful escalation
				res.status.should.equal(404);
				done();
			});
	});

	it('should throw error message for incorrect fields on escalate view', function(done) {

		var params = {
			escalate_reason: '',
			message_body: 'seller did not respond',
			txnId: '3JL3910102390602W',
			caseId: 'PP-000-000-710-094'
		};

		agent
			.post(rootURI + 'resolutioncenter/escalate')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should be able to escalate without partial refund amount', function(done) {

		var params = {
			escalate_reason: 'disputeProcessFailed',
			message_body: 'seller did not respond'
		};

		agent
			.post(rootURI + 'resolutioncenter/escalate')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				
				// User will be redirected to legacy rescenter for successful escalation
				res.status.should.equal(404);
				done();
			});
	});

	it('should be able to escalate with custom partial refund amount', function(done) {

		var params = {
			escalate_reason: 'other',
			suggestedRefund: 'custom',
			refundRequestAmount: 14,
			message_body: 'seller did not respond'
		};

		agent
			.post(rootURI + 'resolutioncenter/escalate')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);

				// User will be redirected to legacy rescenter for successful escalation
				res.status.should.equal(404);
				done();
			});
	});

	it('should throw error message wrong custom partial refund amount', function(done) {

		var params = {
			escalate_reason: 'other',
			suggestedRefund: 'custom',
			refundRequestAmount: 10000,
			message_body: 'seller did not respond',
			txnId: '3JL3910102390602W',
			caseId: 'PP-000-000-710-094'
		};

		agent
			.post(rootURI + 'resolutioncenter/escalate')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});


	it('should able to do claimtypeswitch successfully', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/claimtypeswitch/3JL3910102390602W/PP-000-000-710-094')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
		
	});

	it('should able to do post data for claimtypeswitch successfully', function(done) {

		var params = {
			message_body: 'seller did not respond',
			txnId: '9JL3910102390602W',
			caseId: 'PP-000-000-710-094'
		};

		agent
			.post(rootURI + 'resolutioncenter/claimtypeswitch')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	


});