'use strict';

var _ = require('underscore');

// TODO: Update to handle matching multiple criteria
// TODO: Consider using underscore for easier matching & loops
module.exports = function (req, res, cases) {
	var defaultRes, thisCase, criteria;
	
	for (var i = 0; i < cases.length; i++) {
		thisCase = cases[i];

		if (thisCase.name === 'default') {
			defaultRes = thisCase.response;
		} else {
			criteria = thisCase.criteria[0];

			// uncomment for useful debugging
			//console.log(criteria.param, req.body.data[criteria.param], criteria.value);
			//console.log(criteria.param, req.body.data(criteria.param), criteria.value);

			if (_.isEmpty(req.params) && req.body.data) {
				if (_.isEqual(req.body.data[criteria.param], criteria.value)) {
					res.status(thisCase.response.statusCode);
					return thisCase.response.body;
				}
			} else if (_.isEqual(req.param(criteria.param), criteria.value)) {
				res.status(thisCase.response.statusCode);
				return thisCase.response.body;
			} else {
				//defaultRes = thisCase.response;
			}
		}
	}

	if (defaultRes) {
		res.status(defaultRes.statusCode);
		return defaultRes.body;
	}

	//console.log('!! No default response found in mock service');
	return null;
};