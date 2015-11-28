'use strict';


var erroneous = require('./erroneous'),
	babelfish = require('./babelfish'),
	auth = require('./auth'),
	shush = require('shush');


module.exports = function spec(app) {
	
	// Keeping all the app specific middlewares once user obj set to req object

	app.on('middleware:after:app-authorize', function(eventargs) {

		app.use(erroneous.logWrapper);

		app.use(function setDataModel(req, res, next) {
			// Initialize the req.model
			req.model = {
				data: {}
			};

			// Add URLs to response context
			res.locals.context = res.locals.context || {};
			res.locals.context.requestURI = app.kraken.get('requestURI');
			res.locals.context.legacyURI = app.kraken.get('legacyURI');
			next();
		});

		// Error handling thing
		app.use(erroneous.middleman);

		// Content bundle fetcher
		app.use(babelfish.middleman());

		// Express validator hook
		app.use(erroneous.validator);

		// Service error handling
		app.use(erroneous.messagingHandler);

		// Set devmode as true
		app.use(function setDevMode(req, res, next) {
			if (process.env.NODE_ENV === 'development') {
				req.model.devmode = true;
			}
			next();
		});

	});


	return {
		vault: shush('../config/config.json').vault,
		onconfig: function(config, next) {
			//any config setup/overrides here
			next(null, config);
		}
	};
};