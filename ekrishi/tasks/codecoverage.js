'use strict';

module.exports = function codecoverage(grunt) {

	grunt.loadNpmTasks('grunt-ci-suite');

	return {
		all: {
			src: ['test/unit/**/*.js'],
			options: {
				globals: ['chai', '_', 'Backbone'],
				timeout: 10000,
				ignoreLeaks: true,
				ui: 'bdd',
				reporter: 'dot',
				covDir: 'gh-pages/coverage',
				reportType: 'lcov',
				printType: 'both',
				coverageOptions: '--hook-run-in-context',
				excludes: ['**/public/js/lib/**']
			}
		}
	};
};