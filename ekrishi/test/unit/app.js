/* global require:true, module:true */

'use strict';

process.env.NODE_ENV = 'test';

var mock = require('../../mocks/index'),
	app = require('express')(),
	servicecore = require('servicecore'),
	fixtures = require('./fixtures'),
	erroneous = require('../../lib/erroneous'),
	babelfish = require('../../lib/babelfish'),
	kraken = require('kraken-js'),
	options = {
		onconfig: function(config, next) {
			//config.set('middleware:auth:module:arguments', [fixtures.layout]);
			servicecore.configuration = config.get('services') || {};
			config.set('proxy:trust', true);
			next(null, config);
		}
	};


app.use(kraken(options));

// Added customized middlewares
app.use(fixtures.middleware);

// Added app level middlewares
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

module.exports = app;