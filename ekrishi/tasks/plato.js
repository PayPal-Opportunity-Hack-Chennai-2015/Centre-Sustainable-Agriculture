'use strict';

var path = require('path'),
	confer = require('confer');

module.exports = function complexity(grunt) {

	grunt.loadNpmTasks('grunt-plato');

	return {
		complexity: {
			src: ['controllers/**/*.js', 'lib/*.js', 'models/*.js'],
			dest: 'gh-pages/plato',
			options: {
				jshint: confer(path.resolve('.jshintrc'))
			}
		}
	};
};