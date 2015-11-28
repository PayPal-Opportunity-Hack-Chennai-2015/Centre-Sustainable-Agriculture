'use strict';

var nconf = require('nconf');

module.exports = function loopmocha(grunt) {
  nconf.env()
    .argv();
  // Load task
  grunt.loadNpmTasks('grunt-loop-mocha');
  // Options
  return {
    "src": ["<%=loopmocha.options.basedir%>/spec/*.js"],
    "options": {
      "mocha": {
        "timeout": grunt.option("timeout") || 600000,
        "grep": grunt.option("grep") || 0,
        "debug": grunt.option("debug") || 0,
        "reporter": grunt.option("reporter") || "spec"
      },
      "basedir": process.cwd() + "/" + "test/functional",
      "nemoBaseDir": "<%=loopmocha.options.basedir%>",
      "loop": {
        "reportLocation": grunt.option("reportLocation") || "<%=loopmocha.options.basedir%>/report",
        "parallel": {
          "type": "file"
        }
      },
      "iterations": [{
        "description": "default"
      }]
    },
    "jenkins": {
        "src": "<%=loopmocha.src%>",
        "options": {
            "loop": {
                "noFail": true,
                "parallel": true
            },
            "mocha": {
                "reporter": "mocha-jenkins-reporter"
            },
            "CODE_COVERAGE": "true",
            covDir: 'gh-pages/coverage',
            reportType: 'lcov',
            printType: 'both',
            coverageOptions: '--hook-run-in-context',            
            "NODE_ENV": "jenkins",
            "iterations": [
                {
                    "description": "ci-flow",
                    "mocha": {
                        "grep": "@flow@"
                    },
                    "JUNIT_REPORT_PATH": "<%=loopmocha.options.basedir%>/report/flow" + (new Date()).getTime() + ".xml"
                }
            ]
        }
    }
  };
};
