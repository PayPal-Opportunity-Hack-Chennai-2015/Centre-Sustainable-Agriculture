define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {
	'use strict';

	var View = Backbone.View.extend({

		el: '#transactionDetails',

		events: {
			'click .requestTracking': 'clickRequestTracking'
		},

		initialize: function () {},

		// request tracking
		clickRequestTracking: function (e) {
			e.preventDefault();

			// show spinner feedback
			$(e.target).parent().addClass("spinner");

			// pretend we're not awesome
			window.setTimeout(function (){
				window.location.href = $(".requestTracking a").attr("href");
			}, 2600);
		}
	});

	return View;
});
