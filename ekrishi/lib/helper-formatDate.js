'use strict';

var moment = require('moment'),
	dust = require('dustjs-linkedin');

dust.helpers.formatDate = function (chunk, context, bodies, params) {
	var fallbackLang = 'en-US',
		lang = (context.stack && context.stack.head && context.stack.head.context && context.stack.head.context.locality && context.stack.head.context.locality.locale) || fallbackLang,
		date = dust.helpers.tap(params.date, chunk, context),
		format = dust.helpers.tap(params.format, chunk, context),
		m = moment.unix(date),
		output;

	//Set the language in which the date should be formatted
	m.lang(lang);

	//Format the string
	output = m.format(format);

	//Write the final value out to the template
	return chunk.write(output);
};