/*global describe:true, it:true, require:true, beforeEach:true, process:true, server:true, before:true, after:true */
'use strict';

var testConfig = require('../config/config').mochatestSetup,
	internalIp = process.env[testConfig.openshiftEnvVariable] || 'localhost',
	appPort = testConfig.appPort,
	rootURI = internalIp + ":" + appPort + "/",
	should = require('should'),
	app = require('../app'),
	superagent = require('superagent');


describe('Contact seller page routes testing', function() {
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
			}, 3000);
		});

	});

	after(function(next) {
		server.close(function() {
			console.log("server closed!");
			next();
		});
	});

	it('should display contact seller page', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/contact/3JL3910102390602W')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should display error page for incorrect contact uri', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/contact')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(500);
				done();
			});
	});

	it('should display contact seller page for INR', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/contact/inr/3JL3910102390602W')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should display contact seller page for SNAD', function(done) {
		agent
			.get(rootURI + 'resolutioncenter/contact/snad/3JL3910102390602W')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should create a dipute on contact seller page', function(done) {

		var params = {
			disputeType: 'inr',
			itemCategoryForINR: 'product',
			messageBodyForInr: 'inr test inr test'
		};

		agent
			.post(rootURI + 'resolutioncenter/contact/3JL3910102390602W')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});


	it('should create an INR dipute on contact seller page', function(done) {

		var params = {
			disputeType: 'inr',
			itemCategoryForINR: 'service',
			messageBodyForInr: 'inr test inr test'
		};

		agent
			.post(rootURI + 'resolutioncenter/contact/inr/3JL3910102390602W')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});


	it('should create SNAD dipute on contact seller page', function(done) {

		var params = {
			disputeType: 'snad',
			itemCategoryForSNAD: 'product',
			itemDescription: ['damaged', 'different', 'missingParts'],
			suggestedRefund: 5,
			buyerPurchasedUrl: 'www.ebay.com/item1',
			messageBodyForSnad: 'test test test'
		};

		agent
			.post(rootURI + 'resolutioncenter/contact/snad/3JL3910102390602W')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});


	it('should show error for incorrect INR fields on contact seller page', function(done) {

		var params = {
			disputeType: 'inr',
			itemCategory: 'products',
			messageBodyForInr: 'inr test inr test'
		};

		agent
			.post(rootURI + 'resolutioncenter/contact/inr/3JL3910102390602W')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should show error for incorrect INR fields on contact seller page', function(done) {

		var params = {
			disputeType: 'inr',
			itemCategory: 'products',
			messageBodyForInr: 'inr test inr test'
		};

		agent
			.post(rootURI + 'resolutioncenter/contact/inr/3JL3910102390602W')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

	it('should show error for incorrect SNAD fields on contact seller page', function(done) {

		var params = {
			disputeType: 'snad',
			itemCategory: 'products',
			itemDescription: ['damaged', 'different', 'missingParts'],
			suggestedRefund: 5,
			buyerPurchasedUrl: 'www.ebay.com/item1',
			messageBodyForSnad: 'test test test'
		};

		agent
			.post(rootURI + 'resolutioncenter/contact/snad/3JL3910102390602W')
			.send(params)
			.set('Accept', 'application/json')
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(200);
				done();
			});
	});

});