'use strict';

var csaController = require('./csaController');

module.exports = function(router) {

    router.get('/enquiry', function renderModel(req, res) {
        res.render('csa/index', req.model);
    });
};
