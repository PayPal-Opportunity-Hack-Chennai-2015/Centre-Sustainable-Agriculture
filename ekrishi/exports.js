
var http = require('http');

module.exports = {
	/**
	 * Exposes the model constructors for other apps to use
	 * Usage:
	 	var app = require("ResolutionCenterApp");
	 	var Product = app.getModelConstructor('productModel');
	 */
	getModelConstructor: function (modelName) {
		return require("./models/" + modelName);
	},
	getJsonContent: function (contentFile, locale) {
		var actualLocale = (locale) ? locale : 'en_US';
		return require("./locales/" + actualLocale + "/" + contentFile);
	},
	/**
	 * Helper to load mock JSON data
	 */
	getMockData: function (mockFile, callback) {
		var options = {
			hostname: "localhost",
			port: 8050,
			path: "/" + mockFile
		};

		// Do the request
		var req = http.request(options, function (res)
		{
			var data = '';
			res.setEncoding('utf8');

			res.on('data', function (chunk){
				data += chunk;
			});

			res.on('end', function (){
				var obj = JSON.parse(data);
				if (callback !== undefined && callback !== null) {
					callback(res.statusCode, obj);
				}
			});
		});

		req.on('error', function (err){
			console.log('--- MOCK :: Problem with request for ' + mockFile + ':\n' + err.message);
		});

		req.end();
	}
};