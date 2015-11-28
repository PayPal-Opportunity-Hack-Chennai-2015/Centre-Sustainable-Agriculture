'use strict';


var kraken = require('kraken-js'),
    brogan = require('brogan-paypal'),
    express = require('express'),
    app = express(),
    spec = require('./lib/spec'),
    port = process.env.PORT || 8000,
    isCoverageEnabled = (process.env.DEPLOY_ENV !== 'live' && process.env.CODE_COVERAGE === 'true'),
    istanbul;

// Provide code coverage for functional testcases
if (isCoverageEnabled) {
    istanbul = require('istanbul-middleware');
    istanbul.hookLoader(__dirname);
    app.use('/resolutioncenter/coverage', istanbul.createHandler());
}

app.use(kraken(brogan(spec(app))));


app.listen(port, function (err) {
    if (err) {
        console.error(err.message);
    } else {
        console.log('[%s] Listening on http://localhost:%d', app.settings.env.toUpperCase(), port);
    }
});