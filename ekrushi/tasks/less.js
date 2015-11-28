'use strict';


module.exports = function less(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-less');

	// Options
	return {
		compile: {
			options: {
				paths: ['public/css']
			},
			files: {
				'.build/css/app.css': 'public/css/app.less'
			}
		},
		compress: {
			options: {
				paths: ['public/css'],
				compress: true
			},
			files: {
				'.build/css/app.css': ['public/css/app.less']
			}
		}
	};
};