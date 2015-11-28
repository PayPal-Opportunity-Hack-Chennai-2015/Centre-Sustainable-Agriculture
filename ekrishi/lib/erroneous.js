'use strict';

var expressValidator = require('express-validator'),
	util = require('util'),
	debug = require('debug')('app:lib:erroneous');

// App specific validations

expressValidator.validator.extend('isCurrencyFormat', function (str) {
	var pattern = /^(\d*\.\d{1,2}|\d+)$/g;
	return pattern.test(str);
});

expressValidator.validator.extend('isLessThan', function (num1, num2) {
	return (this.isCurrencyFormat(num1) && (num1 <= num2)) ? true:false;
});

expressValidator.validator.extend('notZero', function (str) {
	return +str === 0 ? false : true;
});

expressValidator.validator.extend('notNegative', function (str) {
	return +str < 0 ? false : true;
});

expressValidator.validator.extend('validDecimal', function (str) {
	return /^\d*(\.\d{0,2})?$/i.test(str);
});
expressValidator.validator.extend('validateDecimal', function (str) {
	return /^\d*(\.\d{0,4})?$/i.test(str);
});

expressValidator.validator.extend('notSpacesOnly', function (str) {
	return !/^\s*$/.test(str);

});

expressValidator.validator.extend('validateMax', function (str) {
	var num = parseFloat(str).toFixed(2);
	num = num * 100;
	return num <= Math.pow(2, 63);
});

expressValidator.validator.extend('notEqual', function (str1, str2) {
	return str1 === str2 ? false : true;
});

module.exports = {
	validator: expressValidator(),

	// before route
	middleman: function (req, res, next) {
		req.session = req.session || {};
		req.model.error = req.session.error || {};
		req.model.formData = req.session.formData || {};
		req.session.error = {};
		req.session.formData = {};

		// Set accountType on data model
		if(req.user){
			req.model.data.accountType = req.user.accountType || '';
		}

		req.addError = function (key, msg, value) {
			// This accepts express validator error arrays
			if (Array.isArray(key)) {
				key.forEach(function (el, idx, arr) {
					req.session.error[el.param] = {
						key: el.param,
						msg: el.msg,
						value: el.value
					};
				});
			} else {
				req.session.error[key] = {key: key, msg: msg, value: value};
			}
		};

		req.hasErrors = function () {
			return (req.session.error && Object.keys(req.session.error).length);
		};

		req.clearErrors = function () {
			req.session.error = {};
		};

		req.setFormData = function (data) {
			req.session.formData = data || req.body;
		};

		req.clearFormData = function () {
			req.session.formData = {};
		};

		next();
	},

	messagingHandler: function (req, res, next) {
		// We don't want service error messages getting carried longer than the next request
		if (req.method === "GET" && req.session.serviceError) {
			req.model.serviceError = req.session.serviceError;
			req.session.serviceError = false;
		}

		req.serviceError = function (service, method, code) {
			var msg = req.dynamicMessages;
			if (msg[service] && msg[service][method] && msg[service][method][code]) {
				req.session.serviceError = msg[service][method][code];
			} else {
				req.session.serviceError = msg.genericServiceError;
			}
		};

		// Sometimes the error code is string
		// This parses the integer and checks if greater than 0 (success)
		req.isErrorCode = function (errorCode) {
			return parseInt(errorCode, 10) > 0;
		};

		if (req.locality) {
			req.getContentBundle('dynamicMessages', null, function (err, bundle) {
				if (err) { next(err); }
				else {
					req.dynamicMessages = bundle._data.dynamicMessages;
					next();
				}
			});
		}
		
	},

	// CAL logging wrapper
	logWrapper: function (req, res, next) {
		// Lets add an optional callback to the req.log to simulate next() calls with errors
		req.logWrap = function (type, msg, callback) {
			// Very first thing to do: let CAL run
			req.log(type, msg);
			// Now let's do our little helper stuff
			var err = new Error(msg);
			if (type === 'error') {
				//console.error(err.stack);
				if (callback) {
					callback(err);
				}
			} else {
				debug('logWrapper: ', msg);

				if (callback) {
					callback();
				}
			}
		};
		next();
	},

	internalError: function () {
		return function errors(err, req, res, next) {

			//note: if the failure occur early in the middleware chain, the req object might not have the log function
			if ( req.log ){
				req.log('error', util.inspect(err));
			}

			debug('internalError: ', util.inspect(err));
			debug('internalError: ', err.stack);

			// Set isConsumer role on data model
			req.model = req.model || {};
			req.model.data = req.model.data || {};
			req.model.data.role = req.model.data.role || {};
			req.model.data.role.isConsumer = req.session.isConsumer;
			req.model.data.accountType = (req.user) ? req.user.accountType : '';
			req.model.viewName = 'error500';

			res.status(500);
			return res.render(req.model.viewName, req.model);
		};
	}
};