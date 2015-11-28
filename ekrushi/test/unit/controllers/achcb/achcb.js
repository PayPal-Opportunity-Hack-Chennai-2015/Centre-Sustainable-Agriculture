'use strict';

var proxyquire = require('proxyquire').noCallThru(),
    assert = require('chai').assert,
    clone= require('clone'),
    should = require('should'),
    metadata= require('g11n-metadata'),
    griffin= require('griffin').useFeature('date').useFeature('number').useMetadata(metadata),
    _ = require('underscore'),
    caseInfo=require('../../data/CaseInfo.json'),
    userInfo=require('../../data/UserInfo.json'),
    refundInfo=require('../../data/RefundInfo.json'),
    transactionInfo=require('../../data/TransactionInfo.json'),
    caseCloseInfo=require('../../data/CaseCloseInfo'),
    docUploadResponse=require('../../data/DocumentUploadResponse.json'),
    achCBController = proxyquire('../../../../controllers/achcb/achcb', {
        "../../models/achCbModel": function(req){

            this.userAccountNumber = req.user.accountNumber;
            this.griffinHandler = req.locality.griffin;

            this.hasErrors = req.validationErrors;
            this.updateError = req.updateError;
            this.loadAcitivitiesError = req.loadAcitivitiesError;
            this.acceptError = req.acceptError;
            this.cancelDisputeError = req.cancelDisputeError;

            this.loadCaseDetails =  function(callback){
                var result ={
                "transactionInfo":transactionInfo,
                "buyerInfo":userInfo,
                "sellerInfo":userInfo,
                "caseInfo":caseInfo,
                "isConsumer":false
                };
                callback(null,clone(result));
            };

            this.updateCase = function(params, callback){
                if(this.updateError){
                    callback("Update service call failed");
                }else{
                    callback(null,clone(caseInfo));
                }
            };

            this.listPaymentActivities= function(params, callback){
                if(this.loadAcitivitiesError){
                    callback("Loading payment activities service call failed");
                }else{
                    callback(null,clone(refundInfo));
                }
            };

            this.acceptBuyersDispute = function(params, callback){
                if(this.acceptError){
                    callback("Accept dispute service call failed");
                }else{
                    callback(null,clone(caseCloseInfo));
                }
            };

            this.cancelDispute = function(params, callback){
                if(this.cancelDisputeError){
                    callback("Cancel Dispute service call failed");
                }else{
                    callback(null,clone(caseCloseInfo));
                }
            };
        },
        "../../models/achcb/uploadModel": function(req, dmsConfig){
            this.hasErrors = req.uploadError;
            this.send = function(callback){
                if(this.hasErrors){
                    callback("Uploading file(s) Failed");
                }else{
                    callback(null,clone(docUploadResponse));
                }
            }
        }
    }),
    dConsts = require("../../../../models/consts/dispute");

describe('starting achcb UT', function () {
    var req = {
        user: {
            accountNumber: 1234567890
        },
        session: {
            actionRequestor: dConsts.actionRequestor.seller
        },
        params: {
            caseId: "PP-D-4080",
            txnId: "553022514C496572Y"
        },
        locality: { timezone: 'America/Los_Angeles',
            country: 'US',
            locale: 'en_US',
            culture: 'en-US',
            language: 'en',
            directionality: 'ltr',
            getCountrySpecifics: [Function],
            formatter: [Function],
            determiners:
            { country: 'viaUserProfile',
                locale: 'viaUserProfile',
                timezone: 'viaUserProfile' }
        },
        model:{
            data:{}
        },
        body:{
            isConsumer:'false'
        },
        query:{
            filterProperty: "EmailId",
            filterValue: "bchirala-rcr12@paypal.com",
            txnDateTime: 1431687370023
        },
        app:{
            kraken:{
                get: function(params){
                    return {
                        protocol: 'http:',
                        hostname: 'stage2cpp099.qa.paypal.com',
                        port: 6502,
                        transport: 'generic',
                        method: 'GET',
                        package: 'docmanagerserv'
                    };
                }
            }
        },
        securityContext:{
            actor:{
                user_type:''
            }
        }
    };

    req.logWrap = function(type, message, callback){
        if(type === "error"){
            console.log(message);
            callback();
        }
    }

    describe('#loadCaseDetails', function () {
        before(function (next) {
            next();
        });

        it('should get case, transaction and user info.', function (next){
            function callback(){
                next();
            };
            achCBController.loadCaseDetails(req, {},callback);
            assert.isDefined(req.model.data.transactionInfo, "Failed to get transaction Info" );
            assert.isDefined(req.model.data.buyerInfo, "Failed to get user Info" );
            assert.isDefined(req.model.data.caseInfo, "Failed to get case Info" );
        });
    });

    describe('#updatecase', function () {
        it('should get fail the updateCase due to request validationErrors.', function (next){
            function callback(){
                    next();
            };
            req.validationErrors=true;
            achCBController.updateCase(req, {},callback);
            assert.notEqual(req.model.data.err.errorType,"", "No error is thrown" );
        });

        it('should get fail the updatecase due to upload failure.', function (next){
            req.model.data.err="";
            function callback(){
                    next();
            };
            req.validationErrors=false;
            req.uploadError=true;
            achCBController.updateCase(req, {},callback);
            assert.isObject(req.model.data.err, "No error is thrown" );
            assert.equal(req.model.data.err.errorList[0].dummyField,"SERVICEERR_001", "Failed with different error" );
        });

        it('should get fail the updateCase due to update service call failure.', function (next){
            req.model.data.err="";
            function callback(){
                    next();
            };
            req.uploadError=false;
            req.updateError=true;
            achCBController.updateCase(req, {},callback);
            assert.isObject(req.model.data.err, "No error is thrown" );
            assert.equal(req.model.data.err.errorList[0].dummyField,"SERVICEERR_001", "Failed with different error" );
        });

        it('should succeed updateCase function call.', function (next){
            req.model.data.err="";
            req.model.data.caseInfo="";
            function callback(){
                    next();
            };
            req.updateError=false;
            achCBController.updateCase(req, {},callback);
            assert.isNotObject(req.model.data.err, "Error is thrown while updating case." );
            assert.notEqual(req.model.data.caseInfo.caseId,"", "Failed to update case" );
        });
    });

    describe('#loadPaymentActivities', function () {
        it('should fail loadPaymentActivities because of the service call failure.', function (next){
            function callback(){
                    next();
            };
            req.loadAcitivitiesError=true;
            achCBController.loadPaymentActivities(req, {},callback);
            assert.isObject(req.model.data.err, "No error is thrown" );
            assert.equal(req.model.data.err.errorList[0].dummyField,"SERVICEERR_001", "Failed with different error" );
        });

        it('should succeed loadPaymentActivities call.', function (next){
            function callback(){
                    next();
            };
            req.model.data.err="";
            req.loadAcitivitiesError=false;
            achCBController.loadPaymentActivities(req, {},callback);
            assert.isNotObject(req.model.data.err, "Error is thrown while loading payment activities." );
            assert.notEqual(req.model.data.length,0, "Failed to load payment activities" );
        });
    });

    describe('#acceptBuyersDispute', function () {
        it('should fail acceptBuyersDispute because of the service call failure.', function (next){
            function callback(){
                    next();
            };
            req.acceptError=true;
            achCBController.acceptBuyersDispute(req, {},callback);
            assert.isObject(req.model.data.err, "No error is thrown" );
            assert.equal(req.model.data.err.errorList[0].dummyField,"SERVICEERR_001", "Failed with different error" );
        });

        it('should succeed acceptBuyersDispute call.', function (next){
            function callback(){
                    next();
            };
            req.model.data.err="";
            req.acceptError=false;
            achCBController.acceptBuyersDispute(req, {},callback);
            assert.isNotObject(req.model.data.err, "Error is thrown while accepting case." );
            assert.isDefined(req.model.data.disputeCloseDate, "Failed to accept case" );
        });
    });

    describe('#cancelDispute', function () {
        it('should fail cancelDispute because of the service call failure.', function (next){
            function callback(){
                    next();
            };
            req.cancelDisputeError=true;
            achCBController.cancelDispute(req, {},callback);
            assert.isObject(req.model.data.err, "No error is thrown" );
            assert.equal(req.model.data.err.errorList[0].dummyField,"SERVICEERR_001", "Failed with different error" );
        });

        it('should succeed cancelDispute call.', function (next){
            function callback(){
                    next();
            };
            req.model.data.err="";
            req.cancelDisputeError=false;
            achCBController.cancelDispute(req, {},callback);
            assert.isNotObject(req.model.data.err, "Error is thrown while cancelling case." );
            assert.isDefined(req.model.data.disputeCloseDate, "Failed to cancel the case" );
        });
    });
});
