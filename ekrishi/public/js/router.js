define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {
	'use strict';

	var Router = Backbone.Router.extend({
		routes: {
			"transactionDetails": "transactionDetails",
			":app/:page(/*data)": "default" // Default catch-all route
		}
	});

	var init = function () {
		var router = new Router;

		router.on("route:transactionDetails", function () {
			require(['transactionDetails'], function (PageView) {
				var view = new PageView();
			});
		});

		router.on("route:default", function (app, page, data) {
			// Attempts to load JS that is of the same path and name as the URL
			// /resolutioncenter/addMobile/escalate -> /js/resolutioncenter/addmobile.js
			require([app.toLowerCase() + '/' + page.toLowerCase()], function (PageView) {
				var view = new PageView();
				//view.render();
			});
		});

		Backbone.history.start({pushState: true, hashChange: false});
	};

	return {
		init: init
	};
});
