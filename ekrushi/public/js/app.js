require(['main'], function () {

	var app = {
		initialize: function () {

			require([
				'jquery',
				'underscore',
				'backbone',
				'router',
				'appview'
			], function ($, _, Backbone, Router, AppView) {
				'use strict';

					var appView = new AppView();
					Router.init();				
			});

		}
	};

	app.initialize();

});
