/*global nemo:true, describe:true, it:true */
var Nemo = require('nemo');
var Navigate = require('../flow/navigate');
var CaseDetails = require('../flow/caseDetails');
var util = require('../util');
var assert = require('assert');

//instance variables
var nemo, navigate, caseDetails;

describe('@flow@', function () {
    before(function (done) {
        nemo = Nemo(function (err) {
            done = util.checkError(err, done);
            navigate = new Navigate(nemo);
            navigate.loginSuccessRCR('bchirala-rcr3-seller@paypal.com', '11111111');
            caseDetails = new CaseDetails(nemo);
            done();
        });
    });

    after(function (done) {
        nemo.driver.quit().then(done);
    });

    it('should execute webscr login and logout', function (done) {
        //navigate.legacyLogout();
        done();
    });

    it('should load the case details', function (done) {
        //navigate.loginSuccessRCR('bchirala-rcr1-seller@paypal.com', '11111111');
        caseDetails.loadCaseDetailsSuccess();
        navigate.merchantLogout();
        done();
    });

});
