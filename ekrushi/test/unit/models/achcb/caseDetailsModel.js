'use strict';

var proxyquire = require('proxyquire').noCallThru(),
    clone= require('clone'),
    servicecore = require('servicecore'),
    sinon = require('sinon'),
    should = require('should'),
    metadata= require('g11n-metadata'),
    griffin= require('griffin').useFeature('date').useFeature('number').useMetadata(metadata),
    _ = require('underscore'),
    disputeDetails= require('../../data/disputeDetails.json'),
    disputeWithJustificationReason= require('../../data/disputeWithJustificationReason.json'),
    disputeWithRecvJustRsn= require('../../data/disputeWithRecvJustRsn.json'),
    updateResponse= require('../../data/updateCaseResponse.json'),
    acceptResponse= require('../../data/acceptDisputeResponse.json'),
    CaseDetailsModel = proxyquire('../../../../models/achcb/caseDetailsModel', {
        "../wrappers/disputeResolutionServ": function(){

            this.getDisputes =  function(disputeId,callback){
                callback(null,{body: clone(disputeInfo)});
            };
        },
        "./calLoggingModel": function(req){
            this.logCalEvent =  function(name, type, data, status){
                return true;
            };
        },
    }),
    dConsts = require("../../../../models/consts/dispute");

describe('caseDetailsModel', function () {
    var req = {
        user: {
            accountNumber: 1997149289729821754
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
        }
    };
    req.locality.griffin= griffin.createHandler(req.locality.culture, req.locality.country);
    var caseDetailsModel= null;

    before(function (next) {
        next();
    });


    it('should create a caseDetailsModel', function (next){
        caseDetailsModel = new CaseDetailsModel(req);
        next();
    });

    describe('#load', function () {

        var servicecoreServStub = null;

        before(function (next) {
            caseDetailsModel = new CaseDetailsModel(req);
            servicecoreServStub = sinon.stub(servicecore,'create');
            next();
        });

        it('should fetch dispute details', function (next){
           var caseDetailsServMock = {
                request: function(requestJSON, callback){
                    callback(null,{body: clone(disputeDetails)});
                }
            };
            //var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(caseDetailsServMock);

            function callback(err,response){
                response.should.have.property('caseId').with.not.empty;
                response.should.have.property('openDate').with.not.empty;
                response.should.have.property('buyerTransactionID').with.not.empty;
                response.should.have.property('sellerTransactionID').with.not.empty;
                response.should.have.property('disputeReason');
                response.should.have.property('disputeChannel');
                response.should.have.property('disputeType').with.not.empty;
                response.should.have.property('sellerExpectedResponseDate');
                response.should.have.property('caseStatus');
                response.should.have.property('buyerAccountNumber').with.not.empty;
                response.should.have.property('sellerAccountNumber').with.not.empty;
                response.should.have.property('isSPPEligible');
                response.should.have.property('paypalResponseDate');
                response.should.have.property('disputeCategory');
                response.should.have.property('justificationReason').with.not.empty;
                next();
            };
            caseDetailsModel.load(callback);
        });

        it('should return justification reason', function (next){
            var caseDetailsServMock = {
                request: function(requestJSON, callback){
                    callback(null, {body: clone(disputeWithRecvJustRsn)});
                }
            };
            //var servicecoreServStub = sinon.stub(servicecore, 'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(caseDetailsServMock);
            function callback(err, response){
                response.should.have.property('justificationReason').with.not.empty;
                next();
            };
            caseDetailsModel.load(callback);
        });

        it('should return justification reason (dispute_decision)', function (next){
            var caseDetailsServMock = {
                request: function(requestJSON, callback){
                    callback(null, {body: clone(disputeWithJustificationReason)});
                }
            };
            //var servicecoreServStub = sinon.stub(servicecore, 'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(caseDetailsServMock);
            function callback(err, response){
                response.should.have.property('justificationReason').with.not.empty;
                next();
            };
            caseDetailsModel.load(callback);
        });

    });
    describe('#acceptBuyersDispute', function () {

        before(function (next) {
            caseDetailsModel = new CaseDetailsModel(req);
            servicecore.create.restore();
            next();
        });

        it('should accept Merchandise  dispute', function (next){

            var disputeDetailsServMock = {
                request: function(requestJSON,callback){
                    callback(null,{body: clone(acceptResponse)});
                }
            };
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(disputeDetailsServMock);
            function callback(err,response){
                response.should.not.empty;
                next();
            };
            var params = {
                disputeCategory: "1"
            };
            caseDetailsModel.acceptBuyersDispute(params,callback);
        });

        it('should accept Unauth  dispute', function (next){

            function callback(err,response){
                response.should.not.empty;
                next();
            };
            var params = {
                disputeCategory: "2"
            };
            caseDetailsModel.acceptBuyersDispute(params,callback);
        });

        it('should accept billing  dispute', function (next){

            function callback(err,response){
                response.should.not.empty;
                next();
            };
            var params = {
                disputeCategory: "3"
            };
            caseDetailsModel.acceptBuyersDispute(params,callback);
        });

        it('should fail accepting the  dispute', function (next){
            servicecore.create.restore();
            var disputeDetailsServMock = {
                request: function(requestJSON,callback){
                    if(requestJSON.method === "POST"){
                        callback(null, {body: "Internal error"});
                    }else{
                        disputeDetails.dispute_status=3;
                        callback(null,{body: clone(disputeDetails)});
                    }

                }
            };
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(disputeDetailsServMock);
            function callback(err,response){
                err.should.not.empty;
                next();
            };
            var params = {
                caseId: "D-21104",
                disputeCategory: "3"
            };
            caseDetailsModel.acceptBuyersDispute(params,callback);
        });

        it('should fail accepting the  dispute with error details', function (next){
            servicecore.create.restore();
            var disputeDetailsServMock = {
                request: function(requestJSON,callback){
                    if(requestJSON.method === "POST"){
                        callback(null, {body: {message:"Internal error"}});
                    }else{
                        callback(null,{body: clone(disputeDetails)});
                        disputeDetails.dispute_status=5;
                    }

                }
            };
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(disputeDetailsServMock);
            function callback(err,response){
                err.should.not.empty;
                next();
            };
            var params = {
                caseId: "D-21104",
                disputeCategory: "3"
            };
            caseDetailsModel.acceptBuyersDispute(params,callback);
        });

    });

    describe('#updateCase', function () {

        before(function (next) {
            caseDetailsModel = new CaseDetailsModel(req);
            next();
        });

        it('should update Merchandise  dispute', function (next){
            servicecore.create.restore();
            var disputeDetailsServMock = {
                request: function(requestJSON,callback){
                    if(requestJSON.method === "PATCH"){
                        callback(null,{body: clone(updateResponse)});
                    }else{
                        callback(null,{body: clone(disputeDetails)});
                    }
                }
            };
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(disputeDetailsServMock);
            function callback(err,response){
                response.should.not.empty;
                next();
            };
            var params = {
                disputeCategory: "1",
                action: "submitPOS",
                comments:"Updated tracking id",
                trackingNumber:"USPS98703567",
                carrier:"USPS",
                documentIdList:[]
            };
            caseDetailsModel.updateCase(params,callback);
        });

        it('should update Unauth  dispute', function (next){

            function callback(err,response){
                response.should.not.empty;
                next();
            };
            var params = {
                disputeCategory: "2",
                action: "submitOtherProof",
                comments:"Uploaded receipts for the goods",
                documentIdList:["s20-001-01-001-37619e1c-23a0-4e63-94ac-f9856846d671",
                                "s20-001-01-001-9e6ba4b6-00b0-48d8-b96d-f95f448cf1a0"]
            };
            caseDetailsModel.updateCase(params,callback);
        });

        it('should update billing  dispute', function (next){

            function callback(err,response){
                response.should.not.empty;
                next();
            };
            var params = {
                disputeCategory: "3",
                action: "submitPOR",
                comments:"",
                refundedTransactionIds: "07367677MF1123126,8P030627EH712150H",
                documentIdList:[]
            };
            caseDetailsModel.updateCase(params,callback);
        });

        it('should fail updating the  dispute', function (next){
            servicecore.create.restore();
            var disputeDetailsServMock = {
                request: function(requestJSON,callback){
                    if(requestJSON.method === "PATCH"){
                        callback(null, {body: "Internal error"});
                    }else{
                        disputeDetails.dispute_status=3;
                        callback(null,{body: clone(disputeDetails)});
                    }
                }
            };
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(disputeDetailsServMock);
            function callback(err,response){
                err.should.not.empty;
                next();
            };
            var params = {
                disputeCategory: "3",
                action: "submitOtherPOR",
                comments:"Uploaded receipts for the goods",
                refundedTransactionIds: "07367677MF1123126,8P030627EH712150H",
                documentIdList:[]
            };
            caseDetailsModel.updateCase(params,callback);
        });

        it('should fail updating the  dispute with error details', function (next){
            servicecore.create.restore();
            var disputeDetailsServMock = {
                request: function(requestJSON,callback){
                    if(requestJSON.method === "PATCH"){
                        callback(null, {body: {message:"Internal error"}});
                    }else{
                        callback(null,{body: clone(disputeDetails)});
                        disputeDetails.dispute_status=5;
                    }
                }
            };
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(disputeDetailsServMock);
            function callback(err,response){
                err.should.not.empty;
                next();
            };
            var params = {
                disputeCategory: "3",
                action: "submitOtherPOR",
                comments:"Uploaded receipts for the goods",
                refundedTransactionIds: "07367677MF1123126,8P030627EH712150H",
                documentIdList:[]
            };
            caseDetailsModel.updateCase(params,callback);
        });
    });

    describe('#cancelDispute', function () {

        before(function (next) {
            caseDetailsModel = new CaseDetailsModel(req);
            next();
        });

        it('should cancel Merchandise  dispute', function (next){
            servicecore.create.restore();
            var disputeDetailsServMock = {
                request: function(requestJSON,callback){
                    callback(null,{body: clone(updateResponse)});
                }
            };
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(disputeDetailsServMock);
            function callback(err,response){
                response.should.not.empty;
                next();
            };
            var params = {
                disputeCategory: "1"
            };
            caseDetailsModel.cancelDispute(params,callback);
        });

        it('should cancel Unauth  dispute', function (next){

            function callback(err,response){
                response.should.not.empty;
                next();
            };
            var params = {
                caseId: "D-21106",
                disputeCategory: "2",
            };
            caseDetailsModel.cancelDispute(params,callback);
        });

        it('should cancel billing  dispute', function (next){

            function callback(err,response){
                response.should.not.empty;
                next();
            };
            var params = {
                caseId: "D-21107",
                disputeCategory: "3",
            };
            caseDetailsModel.cancelDispute(params,callback);
        });

        it('should fail cancelling the  dispute', function (next){
            servicecore.create.restore();
            var disputeDetailsServMock = {
                request: function(requestJSON,callback){
                    if(requestJSON.method === "POST"){
                        callback(null, {body: "Internal error"});
                    }else{
                        disputeDetails.dispute_status=3;
                        callback(null,{body: clone(disputeDetails)});
                    }
                }
            };
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(disputeDetailsServMock);
            function callback(err,response){
                err.should.not.empty;
                next();
            };
            var params = {
                caseId: "D-21104",
                disputeCategory: "3"
            };
            caseDetailsModel.cancelDispute(params,callback);
        });

        it('should fail cancelling the  dispute with error details', function (next){
            servicecore.create.restore();
            var disputeDetailsServMock = {
                request: function(requestJSON,callback){
                    if(requestJSON.method === "POST"){
                        callback(null, {body: {message:"Internal error"}});
                    }else{
                        callback(null,{body: clone(disputeDetails)});
                        disputeDetails.dispute_status=5;
                    }
                }
            };
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('disputeresolutionserv').returns(disputeDetailsServMock);
            function callback(err,response){
                err.should.not.empty;
                next();
            };
            var params = {
                caseId: "D-21104",
                disputeCategory: "3"
            };
            caseDetailsModel.cancelDispute(params,callback);
        });
    });

});

