'use strict';

var	CSAModel = require('../../models/csaModel');

module.exports = {
    getAnswer: function (req, res, next) {
        req.model = req.model || {};

        var csaModel = new CSAModel(req);
        csaModel.getAnswer(function loadAnswerFromDB(err, result) {
            if (err) {
                next(err);
            } else {
                req.model.data = result;
                next();
            }
        });
    }
};
