'use strict';

var path = require('path'),
	request = require('supertest'),
	assert = require('chai').assert,
	erroneous = require('../../../lib/erroneous');

describe('erroneous', function () {
	describe('#middleman', function () {
		var req, res;
		beforeEach(function (next) {
			req = {session: {}, model: {data: {}}, user: {}}, res = {};
			erroneous.middleman(req, res, next);
		});

		it('should create empty error and formData objects', function (next) {
			assert(Object.keys(req.model.error).length === 0);
			assert(Object.keys(req.model.formData).length === 0);
			assert(Object.keys(req.session.error).length === 0);
			assert(Object.keys(req.session.formData).length === 0);
			next();
		});

		it('should attach methods to the request object', function (next) {
			assert.isFunction(req.addError);
			assert.isFunction(req.hasErrors);
			assert.isFunction(req.clearErrors);
			assert.isFunction(req.setFormData);
			assert.isFunction(req.clearFormData);
			next();
		});

		it('should add simple errors', function (next) {
			var desiredOutput = {
				"test1": {
					"key": "test1",
					"msg": undefined,
					"value": undefined
				},
				"test2": {
					"key": "test2",
					"msg": "a message",
					"value": undefined
				},
				"test3": {
					"key": "test3",
					"msg": "a message",
					"value": "a value"
				}
			};
			req.addError("test1");
			req.addError("test2", "a message");
			req.addError("test3", "a message", "a value");

			assert.deepEqual(req.session.error, desiredOutput);
			next();
		});

		it('should add arrays of errors from express validator', function (next) {
			var desiredOutput = {
				"test1": {
					"key": "test1",
					"msg": undefined,
					"value": undefined
				},
				"test2": {
					"key": "test2",
					"msg": "a message",
					"value": undefined
				},
				"test3": {
					"key": "test3",
					"msg": "a message",
					"value": "a value"
				}
			}, errorInput = [
				{
					"param": "test1"
				},
				{
					"param": "test2",
					"msg": "a message"
				},
				{
					"param": "test3",
					"msg": "a message",
					"value": "a value"
				}
			];

			req.addError(errorInput);

			assert.deepEqual(req.session.error, desiredOutput);
			next();
		});

		it('should properly indicate if there has been errors', function (next) {
			var desiredOutput = {
				"test error": {
					key: "test error",
					msg: undefined,
					value: undefined
				}
			};

			assert.deepEqual(req.session.error, {});
			req.addError('test error');
			assert.deepEqual(req.session.error, desiredOutput);
			next();
		});

		it('should allow the developer to clear all errors', function (next) {
			assert.deepEqual(req.session.error, {});
			req.addError('test error');
			assert.notDeepEqual(req.session.error, {});
			req.clearErrors();
			assert.deepEqual(req.session.error, {});
			next();
		});

		it('should allow setting the formData object', function (next) {
			var desiredOutput = {"a_form_key": "a_form_value"};
			assert.deepEqual(req.session.formData, {});
			req.setFormData(desiredOutput);
			assert.deepEqual(req.session.formData, desiredOutput);
			next();
		});

		it('should set formData to req.body in the absense of a parameter when called', function (next) {
			req.body = {"field": "value"};
			assert.deepEqual(req.session.formData, {});
			req.setFormData();
			assert.deepEqual(req.session.formData, req.body);
			next();
		});

		it('should allow clearing the formData', function (next) {
			var desiredOutput = {"a_form_key": "a_form_value"};
			assert.deepEqual(req.session.formData, {});
			req.setFormData(desiredOutput);
			assert.notDeepEqual(req.session.formData, {});
			req.clearFormData();
			assert.deepEqual(req.session.formData, {});
			next();
		});
	});
	describe("#messagingHandler", function () {
		var req, res;
		beforeEach(function (next) {
			req = {
				dynamicMessages: {
					testService: {
						testMethod: {
							10: "Test message"
						}
					},
					genericServiceError: "Generic error"
				},
				session: {},
				model: {},
				getContentBundle: function (a, b, c) {
					c('asfdsadf');
				}
			}, res = {};
			next();
		});

		it('should attach methods to the request object', function (next) {
			erroneous.messagingHandler(req, res, function () {});
			assert.isFunction(req.serviceError);
			next();
		});
		it('should add service errors to req.model on GET requests', function (next) {
			req.session.serviceError = "ERROR!";
			req.method = "GET";
			erroneous.messagingHandler(req, res, function () {});
			assert.equal(req.model.serviceError, "ERROR!");
			assert.isFalse(req.session.serviceError);
			next();
		});
		it('should get an error message for a service/method/code combo if it exists', function (next) {
			erroneous.messagingHandler(req, res, function () {});
			req.serviceError('testService', 'testMethod', 10);
			assert.equal(req.session.serviceError, req.dynamicMessages.testService.testMethod[10]);
			next();
		});
		it('should get a generic error message for content key misses', function (next) {
			erroneous.messagingHandler(req, res, function () {});
			req.serviceError('asdf', 'qwerty', 15);
			assert.equal(req.session.serviceError, req.dynamicMessages.genericServiceError);
			next();
		});
	});


	describe("#internalError", function () {
		var req, res, err, next;
		beforeEach(function (next) {
			req = {
				log:'log message',
				session: {},
				model: {}
			}, res = {};
			next();
		});

		it('should attach methods to the request object', function (next) {

			erroneous.internalError(req, res, function () {});
			next();
		});
		
	});


});