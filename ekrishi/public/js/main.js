(function() {

	'use strict';

	requirejs.config({
		baseUrl: '/resolutioncenter/js',
		shim: {
			'backbone': {
				deps: ['underscore', 'jquery'],
				exports: 'Backbone'
			},
			'jquery': {
				exports: 'jQuery'
			},
			'jqueryUI': ['jquery'],
			'cookie': ['jquery'],
			'bootstrap': ['jquery'],
			'ErrorPrompt': ['jquery'],
			'bootstrapAccessibility': ['bootstrap'],
			'opinionLabComponent': ['onlineOpinionPopup', 'opinionLab']
		},
		useStrict: true,
		paths: {
			jquery: 'lib/jquery-1.10.2',
			jqueryUI: 'lib/jquery-ui-1.10.3',
			underscore: 'lib/underscore-1.5.1',
			backbone: 'lib/backbone-1.0.0',
			ErrorPrompt:'lib/errorPrompter',
			appview: 'appView',
			bootstrap: '../components/bootstrap/dist/js/bootstrap',
			bootstrapAccessibility: 'lib/bootstrap-accessibility.min',
			cookie: 'lib/jquery.cookie',
			opinionLab: '../components/UVLOpinionLab/js/opinionLab',
			onlineOpinionPopup: '../components/UVLOpinionLab/js/onlineOpinionPopup',
			opinionLabComponent: '../components/UVLOpinionLab/js/opinionLabComponent'
		}
	});

	//INFO: Uncomment the following line to trigger pisces
	//require(["http://pisces-168854.slc01.dev.ebayc3.com/js/pisces.js"]);
})();
