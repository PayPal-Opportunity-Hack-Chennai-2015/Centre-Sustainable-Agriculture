/*global describe:true, it:true, require:true, beforeEach:true, process:true, server:true, before:true, after:true */
'use strict';

var testConfig = require('../../config/config').mochatestSetup,
	internalIp = process.env[testConfig.openshiftEnvVariable] || 'localhost',
	appPort = testConfig.appPort,
	rootURI = internalIp + ":" + appPort + "/",
	should = require('should'),
	app = require('../../app'),
	superagent = require('superagent');


describe('Message page routes testing', function() {
	var agent = superagent.agent(),
		server,req;

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

	it('should display messages page', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/messages/3JL3910102390602W/PP-000-000-710-094')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});
	
	
	
	
	it('should add new message for genric case successfully', function(done) {

		var params = {
			solution: 'generic',
			messageBodyForGeneric: 'message text message text'
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL3910102390602W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should add new message for refund case successfully', function(done) {

		var params = {
			solution: 'refund',
			messageBodyForRefund: 'message text message text'
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL3910102390602W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});


	it('show error for incorrect inputs of add new message usecase successfully', function(done) {

		var params = {
			solution: 'generic',
			messageBodyForGeneric: ''
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL3910102390602W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});


	it('show error for incorrect inputs of add new message for refund usecase successfully', function(done) {

		var params = {
			solution: 'refund',
			messageBodyForRefund: ''
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL3910102390602W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});



	it('should add photo evidence email successfully', function(done) {

		var params = {
			solution: 'generic',
			messageBodyForGeneric: 'adding photo evidence email',
			photoEvidenceCheck: 'true',
			sellerEmailForPhotoEvidence: 'some@gmail.com'
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);				
				res.status.should.equal(200);
				done();
			});
	});

	it('should post message', function(done) {

		var params = {
			solution: 'common',
			messageBodyForCommon: 'adding post message'
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);				
				res.status.should.equal(200);
				done();
			});
	});
	
	it('should post message for send refund now successfully', function(done) {

		var params = {
			solution: 'sendRefundNow',
			messageBody: 'messages for send refund'
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);				
				res.status.should.equal(200);
				done();
			});
	});

	it('should post message for handle offer for continue offer', function(done) {

		var params = {
			continueOffer: 'Continue',
			sellerProposedRefund: '10',
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);				
				res.status.should.equal(200);
				done();
			});
	});

	it('should post message for handle offer for accept offer', function(done) {

		var params = {
			acceptOffer: 'Accept Offer',
			showBuyerAcceptOffer : 'true'
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);				
				res.status.should.equal(200);
				done();
			});
	});


	it('should post message for handle offer for accept resolve offer', function(done) {

		var params = {
			acceptResolveOffer: 'Accept Offer',
			showBuyerAcceptOffer : 'true'
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);				
				res.status.should.equal(200);
				done();
			});
	});

	it('should post message for handle offer for Send Refund Now', function(done) {

		var params = {
			sendRefund: 'Send Refund Now',
			showSellerSendRefundNow  : 'true'
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);				
				res.status.should.equal(200);
				done();
			});
	});

	it('should post message for handle decline offer', function(done) {

		var params = {
			declineOffer: 'Decline Offer',
			showBuyerDeclinedOffer: 'true'
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/3JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);				
				res.status.should.equal(200);
				done();
			});
	});

	it('should post message for handle continue offer for calculate fee error', function(done) {

		var params = {
			continueOffer: 'Continue'
		};

		agent
			.post(rootURI + 'resolutioncenter/messages/2JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);				
				res.status.should.equal(200);
				done();
			});
	});
});