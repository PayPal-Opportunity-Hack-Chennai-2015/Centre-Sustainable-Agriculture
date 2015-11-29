"use strict";

var path = require('path'),
	request = require('supertest'),
	assert = require('chai').assert,
	babelfish = require('../../../lib/babelfish'),
	makaraConfig = {
        fallback: 'en_US',
        contentRoot: process.cwd() + '/test/unit/fixtures',
        cache: false,
        enableHtmlMetadata: false
    };

describe('babelfish', function () {
	it('should attach the getContentBundle method to the request object', function (next) {
		var req = {},
			res = {};
		function callback (err) {
			assert.notOk(err);
			assert.isFunction(req.getContentBundle);
			next();
		}
		babelfish.middleman(makaraConfig)(req, res, callback);
	});

	describe('#getContentBundle', function () {

		it('should return a content bundle with our expected string (en_US with null locale)', function (next) {
			var req = {
					locality: {
						locale: "en_US"
					}
				},
				res = {};

			function callback (err) {
				assert.notOk(err);
				assert.isFunction(req.getContentBundle);
				req.getContentBundle('bundle', null, bundleCallback)
			}
			function bundleCallback (err, bundle) {
				assert.notOk(err);
				assert.equal(bundle.get('bundle.hello'), 'hello');
				next();
			}
			babelfish.middleman(makaraConfig)(req, res, callback);
		});

		it('should return a content bundle with our expected string (de_DE override)', function (next) {
			var req = {
					locality: {
						locale: "en_US"
					}
				},
				res = {};

			function callback (err) {
				assert.notOk(err);
				assert.isFunction(req.getContentBundle);
				req.getContentBundle('bundle', 'de_DE', bundleCallback)
			}
			function bundleCallback (err, bundle) {
				assert.notOk(err);
				assert.equal(bundle.get('bundle.hello'), 'guten tag');
				next();
			}
			babelfish.middleman(makaraConfig)(req, res, callback);
		});
	});
});