'use strict';

var makara = require('makara'),
	path = require('path'),
	makaraConfig = {
		fallback: 'en_US',
		contentRoot: path.join(process.cwd(), 'locales'),
		cache: true,
		enableHtmlMetadata: false
	};

module.exports = {

	middleman: function (config) {
		makaraConfig = config || makaraConfig;
		return function (req, res, next) {
			var provider = makara.create(makaraConfig);
			req.getContentBundle = function (bundle, locale, callback) {
				locale = locale || req.locality.locale;
				provider.getBundle(bundle, locale, callback);
			};
			next();
		};
	}
};