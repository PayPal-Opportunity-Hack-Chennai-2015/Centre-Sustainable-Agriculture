/*global describe:true, it:true, require:true, beforeEach:true, process:true, server:true, before:true, after:true */
'use strict';

var testConfig = require('../../config/config').mochatestSetup,
	internalIp = process.env[testConfig.openshiftEnvVariable] || 'localhost',
	appPort = testConfig.appPort,
	rootURI = internalIp + ":" + appPort + "/",
	should = require('should'),
	app = require('../../app'),
	superagent = require('superagent');


describe('Message page routes testing for Send Offer', function() {
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


	it('should display send offer page', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/messages/sendoffer/confirm/3JL0000000000002W/PP-000-000-710-094')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});


	it('should post from send offer page for propose offer', function(done) {

		var params = {					
			send : "send offer",
			invoiceNumber:"1234567890"
			
		};
		agent
			.post(rootURI + 'resolutioncenter/messages/sendoffer/confirm/3JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'text/html')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should post cancel offer from send offer page for propose offer', function(done) {

		var params = {					
			cancelOffer : "cancel",
			invoiceNumber:"1234567890"
			
		};
		agent
			.post(rootURI + 'resolutioncenter/messages/sendoffer/confirm/3JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'text/html')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should edit send offer options successfully', function(done) {

		var params = {					
			sendOfferEdit :true,
			invoiceNumber:"1234567890"
			
		};
		agent
			.post(rootURI + 'resolutioncenter/messages/sendoffer/confirm/3JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'text/html')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should propose partial refund with return offer from send offer page', function(done) {

		var params = {					
			sellerProposedRefund: '8',
			messageBodyForSellerOffer: 'message text',
			offerType: 'return',
			
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

	it('should propose partial refund with replace offer from send offer page', function(done) {

		var params = {					
			sellerProposedRefund: '8',
			messageBodyForSellerOffer: 'message text',
			offerType: 'replace'
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

	

	
	it('should send offer from send offer page', function(done) {
		agent
			.post(rootURI + 'resolutioncenter/messages/sendoffer/confirm/3JL0000000000002W/PP-000-000-710-094')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	


	it('should accept partial refund with return offer from send offer page', function(done) {

		var params = {					
			solution: 'accept',
			messageBodyForAccept: 'accept message text'

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

	it('should decline partial refund with return offer from send offer page', function(done) {

		var params = {					
			solution: 'decline',
			messageBodyForDecline: 'decline message text'	
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


	it('should post message for seller proposed offer successfully', function(done) {

		var params = {
			solution: 'offer',
			messageBodyForSellerOffer: 'messages for seller provided offer'
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

	it('should propose partial refund offer', function(done) {

		var params = {					
			invoiceNumber: '1234567890',
			send: "Send offer"
		};
		agent
			.post(rootURI + 'resolutioncenter/messages/sendoffer/confirm/4JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'text/html')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should accept partial refund offer', function(done) {

		var params = {					
			invoiceNumber: '1234567890',
			send: "Send offer"
		};
		agent
			.post(rootURI + 'resolutioncenter/messages/sendoffer/confirm/5JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'text/html')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should send only message from for send offer', function(done) {

		var params = {					
			invoiceNumber: '1234567890',
			send: "Send offer"
		};
		agent
			.post(rootURI + 'resolutioncenter/messages/sendoffer/confirm/6JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'text/html')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should send  message for fast track for send offer', function(done) {

		var params = {					
			invoiceNumber: '1234567890',
			send: "Send offer"
		};
		agent
			.post(rootURI + 'resolutioncenter/messages/sendoffer/confirm/8JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'text/html')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should send  message from seller while proposing offer from send offer', function(done) {

		var params = {					
			invoiceNumber: '1234567890',
			send: "Send offer"
		};
		agent
			.post(rootURI + 'resolutioncenter/messages/sendoffer/confirm/9JL0000000000002W/PP-000-000-710-094')
			.send(params)
			.set('Accept', 'text/html')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should seller propose refund to buyer successfully', function(done) {

		agent
			.get(rootURI + 'resolutioncenter/messages/sendoffer/confirm/7JL0000000000002W/PP-000-000-710-094')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should seller propose refund to buyer successfully', function(done) {

		agent
			.get(rootURI + 'resolutioncenter/messages/sendoffer/confirm/1AB0000000000002W/PP-000-000-710-094')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});


});