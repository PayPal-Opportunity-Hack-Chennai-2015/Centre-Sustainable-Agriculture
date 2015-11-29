'use strict';

module.exports = {

	/* Get the user cookie to the actual authenticated user rather than the dummy user */
	getAuthenticationToken: function (req, res) {
		res.json(req.model.body);
	},

	getUserName: function (req) {
		var cookie = req.headers.cookie,
			encodedEmail = cookie.replace(/^.*ogin_email=([a-z]+(%40paypal.com)?).*$/, '$1'), // grabs 'undefined' or 'somescenario%40paypal.com'
			username = decodeURIComponent(encodedEmail);

		return username;
	},

	/* Set the user cookie to the actual authenticated user rather than the dummy user */
	createtoken: function (req, res) {
		var username = encodeURIComponent(req.body.data.username),
			loginCookie = 'login_email=' + username + ';',
			cookie = req.model.headers['set-cookie'],
			i;

		if (username) {
			for (i = 0; i < cookie.length; i++) {
				cookie[i] = cookie[i].replace(/login_email=(.*?)\;/, loginCookie);
			}
		}
		res.set('set-cookie', cookie);
		res.json(req.model.body);
	}
};