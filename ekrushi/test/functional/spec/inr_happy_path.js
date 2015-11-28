"use strict";

var assert = require('chai').assert,
	nemo = require('nemo'),
	setup;

describe('Nemo ', function() {

	before(function(done) {
		(new nemo()).setup({}).
		then(function(result) {
			//console.log(result)
			setup = result;
			done();
		})
	});

	after(function(done) {
		setup.driver.quit().then(function() {
			done();
		});
	});
	
	it('should complete setup and load the base URL', function(done) {
		var driver = setup.driver;
			driver.get(setup.targetBaseUrl + '/login').
			then(function() {
				done()
			}, function(err) {
				done(err);
			});

	});

});