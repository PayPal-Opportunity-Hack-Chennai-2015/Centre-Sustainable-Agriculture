'use strict';

var proxyquire = require('proxyquire').noCallThru(),
    assert = require('chai').assert,
    clone= require('clone'),
    servicecore = require('servicecore'),
    sinon = require('sinon'),
    should = require('should'),
    metadata= require('g11n-metadata'),
    griffin= require('griffin').useFeature('date').useFeature('number').useMetadata(metadata),
    _ = require('underscore'),
    caseInfo=require('../../data/CaseInfo.json'),
    userInfo=require('../../data/UserInfo.json'),
    refundInfo=require('../../data/RefundInfo.json'),
    uploadedFiles=require('../../data/UploadFilesInfo.json'),
    transactionInfo=require('../../data/TransactionInfo.json'),
    disputeInfo= require('../../data/disputeDetails.json'),
    acceptResponse= require('../../data/acceptDisputeResponse.json'),
    AchCbModel = proxyquire('../../../../models/achCbModel', {
        "./achcb/caseDetailsModel": function(req){
            this.load =  function(callback){
                callback(null,clone(caseInfo));
            };

            this.updateCase = function(params,callback){
                callback(null,clone(caseInfo));
            };

            this.acceptBuyersDispute = function(params, callback){
                callback(null,clone(acceptResponse));
            };

            this.cancelDispute = function(params, callback){
                callback(null, {"op_status":"success"});
            };
        },
        "./achcb/transactionDetailsModel": function(req){
            this.loadTransaction = function(params, callback){
                callback(null,clone(transactionInfo));
            };

            this.fetchPaymentActivities= function(params,callback){
                callback(null,clone(refundInfo));
            }
        },
        "./userModel": function(){
            this.load = function(accountNumber,callback){
                callback(null,{viewModel: clone(userInfo)});
            }
        }
    }),
    dConsts = require("../../../../models/consts/dispute");

describe('achCbModel', function () {
    var req = {
        user: {
            accountNumber: "1518314013452779507"
        },
        session: {
            actionRequestor: dConsts.actionRequestor.seller
        },
        params: {
            caseId: "D-21102",
            txnId: "81J73496KF720944T"
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
        body:{}
    };
    req.locality.griffin= griffin.createHandler(req.locality.culture, req.locality.country);
    var achCbModel= null;

    before(function (next) {
        next();
    });


    it('should create a achCbModel', function (next){
        achCbModel = new AchCbModel(req);
        next();
    });

    describe('#loadCaseDetails', function () {
        before(function (next) {
            achCbModel = new AchCbModel(req);
            next();
        });

        it('should fetch case, user and transaction details', function (next){
            function callback(err,response){
                response.should.not.empty;
                next();
            };
            achCbModel.loadCaseDetails(callback);
        });
    });

    describe('#validate', function () {
        before(function (next) {
            achCbModel = new AchCbModel(req);
            next();
        });

        it('should fail submitPOS request validation as no tracking number or documentId list is provided', function (next){
            req.body = {
                disputeCategory: "1",
                action: "submitPOS",
                uploadDocType:"shipping",
                comments:"Updated tracking id"
            };
            achCbModel.validate(req);
            assert.notEqual(achCbModel.validationErrors.length,0, "No Error thrown");
            assert.equal(achCbModel.validationErrors[0].trackingNumber, "POS_001","Failed with different error");
            next();
        });

        it('should fail submitPOS request validation as no carrier info is provided in request', function (next){
            req.body = {
                disputeCategory: "1",
                action: "submitPOS",
                uploadDocType:"shipping",
                comments:"Updated tracking id",
                trackingNumber:"USPS98703567",
                carrier:"DEFAULT"
            };
            achCbModel.validationErrors=[];

            req.files={};
            achCbModel.validate(req);
            assert.notEqual(achCbModel.validationErrors.length,0, "No Error thrown");
            assert.equal(achCbModel.validationErrors[0].carrier, "POS_002","Failed with different error");
            next();
        });

        it('should pass submitPOS request validation', function (next){
            achCbModel.validationErrors=[];
            req.body = {
                disputeCategory: "1",
                action: "submitPOS",
                uploadDocType:"shipping",
                comments:"Updated tracking id",
            };
            req.files = uploadedFiles;
            achCbModel.validate(req);
            assert.equal(achCbModel.validationErrors.length,0, "Error is thrown");
            next();
        });

        it('should fail submitPOR request validation as there are no refund transaction numbers provided', function (next){
            req.body = {
                action: "submitPOR",
                disputeCategory: "3",
                refundedTransactionIds: ""
            };
            achCbModel.validate(req);
            assert.notEqual(achCbModel.validationErrors.length,0, "No Error thrown");
            assert.equal(achCbModel.validationErrors[0].dummyField, "POR_001","Failed with different error");
            next();
        });

        it('should fail submitPOR request validation as one transactionId is not proper', function (next){
            achCbModel.validationErrors=[];
            req.body = {
                action: "submitPOR",
                disputeCategory: "3",
                refundedTransactionIds: "123456,8P030627EH712150H"
            };
            achCbModel.validate(req);
            assert.notEqual(achCbModel.validationErrors.length,0, "No Error thrown");
            assert.equal(achCbModel.validationErrors[0].dummyField, "COMMON_001","Failed with different error");
            next();
        });

        it('should pass submitPORSearch request validation ', function (next){
            achCbModel.validationErrors=[];
            req.body = {
                action: "submitPORSearch",
                disputeCategory: "3",
                refundedTransactionIds: "07367677MF1123126,8P030627EH712150H",
            };
            achCbModel.validate(req);
            assert.equal(achCbModel.validationErrors.length,0, "Error is thrown");
            next();
        });

        it('should fail submitOtherPOR request validation as no uploaded files info provided ', function (next){
            req.body = {
                disputeCategory: "1",
                action: "submitOtherPOR",
                uploadDocType:"refund",
                comments:"Uploaded receipts.",
            };
            req.files = {};
            achCbModel.validate(req);
            assert.notEqual(achCbModel.validationErrors.length,0, "No Error thrown");
            assert.equal(achCbModel.validationErrors[0].POROtherUploadFile, "COMMON_001","Failed with different error");
            next();
        });

        it('should fail submitOtherPOR request validation as no comments provided. ', function (next){
            achCbModel.validationErrors=[];
            req.body = {
                disputeCategory: "1",
                action: "submitOtherPOR",
                uploadDocType:"refund",
            };
            req.files = uploadedFiles;
            achCbModel.validate(req);
            assert.notEqual(achCbModel.validationErrors.length,0, "No Error thrown");
            assert.equal(achCbModel.validationErrors[0].otherPORComments, "COMMON_001","Failed with different error");
            next();
        });

        it('should pass submitOtherPOR request validation. ', function (next){
            achCbModel.validationErrors=[];
            req.body = {
                disputeCategory: "1",
                action: "submitOtherPOR",
                uploadDocType:"refund",
                comments:"Uploaded receipts.",
            };
            req.files = uploadedFiles;
            achCbModel.validate(req);
            assert.equal(achCbModel.validationErrors.length,0, "Error is thrown");
            next();
        });

        it('should fail submitOtherProof request validation as the no uploaded files info provided ', function (next){
            req.body = {
                disputeCategory: "1",
                action: "submitOtherProof",
                uploadDocType:"others"
            };
            req.files = {};
            achCbModel.validate(req);
            assert.notEqual(achCbModel.validationErrors.length,0, "No Error thrown");
            assert.equal(achCbModel.validationErrors[0].otherProofUploadFile, "COMMON_001","Failed with different error");
            next();
        });

        it('should pass submitOtherProof request validation ', function (next){
            achCbModel.validationErrors=[];
            req.body = {
                disputeCategory: "1",
                action: "submitOtherProof",
                uploadDocType:"others",
                comments:"Uploaded receipts."
            };
            req.files = uploadedFiles;
            achCbModel.validate(req);
            assert.equal(achCbModel.validationErrors.length,0, "Error is thrown");
            next();
        });
    });

    describe('#validateUploadedFiles', function () {
        before(function (next) {
            achCbModel = new AchCbModel(req);
            next();
        });

        it('should fail validation as the file size is more than 5MB (5*1024*1024)', function (next){
            var validationErrors = [];
            req.files = uploadedFiles;
            req.files.Receipt1.size=5245800;
            achCbModel.validateUploadedFiles(req, validationErrors);
            assert.notEqual(validationErrors.length,0, "No Error thrown");
            assert.equal(validationErrors[0].dummyField, "FILEUPLD_001","Failed with different error");
            next();
        });

        it('should fail validation as the file size is zero', function (next){
            var validationErrors = [];
            req.files = uploadedFiles;
            req.files.Receipt1.size=0;
            achCbModel.validateUploadedFiles(req, validationErrors);
            assert.notEqual(validationErrors.length,0, "No Error thrown");
            assert.equal(validationErrors[0].dummyField, "FILEUPLD_002","Failed with different error");
            next();
        });

        it('should fail validation as the file type is not in required file formant list', function (next){
            var validationErrors = [];
            req.files.Receipt1.size=27305;
            req.files.Receipt1.type="bmp";
            achCbModel.validateUploadedFiles(req, validationErrors);
            assert.notEqual(validationErrors.length,0, "No Error thrown");
            assert.equal(validationErrors[0].dummyField, "FILEUPLD_003","Failed with different error");
            next();
        });
    });

    describe('#acceptBuyersDispute', function () {
        before(function (next) {
            achCbModel = new AchCbModel(req);
            next();
        });

        it('should accept dispute', function (next){
            var params = {
                caseId: "D-21102",
                disputeCategory: "1"
            };

            function callback(err,response){
                response.should.not.empty;
                next();
            };

            achCbModel.acceptBuyersDispute(params, callback);
        });
    });

    describe('#updateCase', function () {
        before(function (next) {
            achCbModel = new AchCbModel(req);
            next();
        });

        it('should update dispute', function (next){
            var params = {
                caseId: "D-21105",
                disputeCategory: "1",
                action: "submitPOS",
                comments:"Updated tracking id",
                trackingNumber:"USPS98703567",
                carrier:"USPS",
                documentIdList:[]
            };

            function callback(err,response){
                response.should.not.empty;
                next();
            };

            achCbModel.updateCase(params, callback);
        });
    });

    describe('#cancelDispute', function () {
        before(function (next) {
            achCbModel = new AchCbModel(req);
            next();
        });

        it('should cancel dispute', function (next){
            var params = {
                    "buyter_notes": "Please close this dispute"
                };

            function callback(err,response){
                response.should.not.empty;
                next();
            };

            achCbModel.cancelDispute(params, callback);
        });
    });
    describe('#listPaymentActivities', function () {
        before(function (next) {
            achCbModel = new AchCbModel(req);
            next();
        });

        it('should get the payment activities', function (next){
            var params = {
                filterProperty: "EmailId",
                filterValue: "bchirala-rcr12@paypal.com"
            };

            function callback(err,response){
                response.should.not.empty;
                next();
            };

            achCbModel.listPaymentActivities(params, callback);
        });
    });
});
