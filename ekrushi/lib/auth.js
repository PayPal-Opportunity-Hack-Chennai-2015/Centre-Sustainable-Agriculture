'use strict';

var ppauth = require('auth-paypal');

module.exports.authorize = function() {
	return function authorize(req, res, next) {

		var baseURI = req.app.kraken.get('requestURI'),
			fullUrl = req.protocol + '://' + req.get('host') + '/resolutioncenter',
			unifiedLoginUrl = '/signin?returnUri=',
			isUrlExist = false,

			// Unified Login Integration - returnUri list of RCR
			returnUrlList = [
				'^\/resolutioncenter\/messages\/([A-z0-9]{10,20})\/(PP-[0-9]{3}-[0-9]{3}-[0-9]{3}-[0-9]{3})[/\]?$',
				'^\/resolutioncenter\/contact\/([A-z0-9]{10,20})[/\]?$',
				'^\/resolutioncenter\/achcb\/case\/([A-z0-9-]{5,20})[/\]?$',
				'^\/resolutioncenter\/disputes\/([A-z0-9-]{5,20})[/\]?$',
                '^\/resolutioncenter\/csa\/([A-z0-9-]{5,20})[/\]?$'
			];

		ppauth.authorize(function(err, actor, info) {

			req.log('debug', {
				page: req.baseUrl,
				err: err,
				info: info,
				msg: '[ppauth.authorize] is called'
			});

			if (actor) {
				if (actor.account_number) {

					// Set accountNumber in req.user object
					// After ppauth@2.0, req.user.accountumber was removed. Hence, adding it back.
					req.user.accountNumber = actor.account_number;
					req.user.actorInfoVO.actorId = actor.id;
					next();
				} else {
					req.log('debug', "[ppauth.authorize] Not loading actor object properly");
					req.model.viewName = "error500";
					res.render(req.model.viewName, req.model);
				}
			} else {
				req.log('info', "[ppauth.authorize] Authorization is failed, so redirecting to login");

				// checking whether the route path can be allowed as returnUri
				isUrlExist = returnUrlList.some(function checkUrlAllowed (allowedUrl){
					var allowedUrlRegEx = new RegExp(allowedUrl);
					return allowedUrlRegEx.test(req.originalUrl);
				});

				fullUrl = (isUrlExist) ? (req.protocol + '://' + req.get('host') + req.originalUrl) : fullUrl;

				if (process.env.NODE_ENV === 'development') {
					unifiedLoginUrl = 'https://www.' + req.app.kraken.get('topos:host') + unifiedLoginUrl;
				}

				unifiedLoginUrl += encodeURIComponent(fullUrl);

				if (req.xhr && req.accepts('application/json')) {
					res.json({
						'redirect': unifiedLoginUrl
					});
				} else {
					res.redirect(unifiedLoginUrl);
				}
			}
		})(req, res, next);
	};
};
