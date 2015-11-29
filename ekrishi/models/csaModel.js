'use strict';


function CSAModel(req) {

}

CSAModel.prototype = {

    getAnswer: function (callback) {
        var that = this;
        req.model = req.model || {};
        req.model.data = req.model.data || {};
        req.model.data.role = {};
        req.model.data.role.isConsumer = result.isConsumer + "";
        callback(null, 'data');
    }


};

module.exports = CSAModel;
