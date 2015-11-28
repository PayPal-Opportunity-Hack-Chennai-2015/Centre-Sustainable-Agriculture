'use strict';

var assert = require('chai').assert,
	proxyquire = require('proxyquire').noCallThru(),
    servicecore = require('servicecore'),
    clone= require('clone'),
    sinon = require('sinon'),
    should = require('should'),
    querystring = require('querystring'),
    _ = require('underscore'),
    paymentActivities= require('../../../data/paymentActivities.json'),
	ActivitySearchServ = require('../../../../../models/wrappers/activitySearchServ'),
	dConsts = require("../../../../../models/consts/dispute");

describe('activitySearchServ', function () {
	var req = {
		user: {
			accountNumber: 1234567890,
            actorInfoVO: {
                actorId: '217830',
                actorPartyId: '0'
            }
		},
		session: {
			actionRequestor: dConsts.actionRequestor.seller
		},
		params: {
			caseId: "PP-000-000-704-286",
			txnId: "553022514C496572Y"
		}
	};
    var activitySearchServ= null;

    before(function (next) {
        next();
    });


	it('should create a ActivitySearchServ wrapper', function (next){
        activitySearchServ = new ActivitySearchServ(req);
		next();
	});

	describe('#findPaymentActivites', function () {

        before(function (next) {
            next();
        });

		it('should map the application filters to service filters', function (next){
            activitySearchServ = new ActivitySearchServ(req);
            var params={
                'counterPartyEmail': 'bchirala-rcr1-seller@paypal.com',
                'firstName': 'xxxx',
                'lastName': 'yyyy',
                'invoiceID': '12345',
                'transactionID': '54321',
                'transactionSubType': 'REFUND',
                'activityType': 'PAYMENT',
                'transactionStatuses': 'COMPLETED,HOLD',
                'pageSize': '10'
            };

            var activitySearchServMock = {
                request: function(requestJSON,callback){
                    var queryParams= querystring.parse(requestJSON.qs);
                    queryParams.should.have.property('email').equal('bchirala-rcr1-seller@paypal.com');
                    queryParams.should.have.property('first_name').equal('xxxx');
                    queryParams.should.have.property('last_name').equal('yyyy');
                    queryParams.should.have.property('invoice_ids').equal('12345');
                    queryParams.should.have.property('payment_ids').equal('54321');
                    queryParams.should.have.property('subtype').equal('REFUND');
                    queryParams.should.have.property('activity_types').equal('PAYMENT');
                    queryParams.should.have.property('statuses').equal('COMPLETED,HOLD');
                    queryParams.should.have.property('page_size').equal('10');
                    callback(null,{ body: clone(paymentActivities) });
                }
            };
            servicecore.create.restore();
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('activitysearchserv').returns(activitySearchServMock);
            function callback(err,response){
                next();
            };
            activitySearchServ.findPaymentActivites(params,callback);
		});

        it('should throw error if there is an error response', function (next){
            activitySearchServ = new ActivitySearchServ(req);
            var params={
                'counterPartyEmail': 'bchirala-rcr1-seller@paypal.com',
                'firstName': 'xxxx',
                'lastName': 'yyyy',
                'invoiceID': '12345',
                'transactionID': '54321',
                'transactionSubType': 'REFUND',
                'activityType': 'PAYMENT',
                'transactionStatuses': 'COMPLETED,HOLD',
                'pageSize': '10'
            };

            var activitySearchServMock = {
                request: function(requestJSON,callback){
                    callback(new Error("Service Failure"));
                }
            };
            servicecore.create.restore();
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('activitysearchserv').returns(activitySearchServMock);
            var callback= sinon.spy();
            activitySearchServ.findPaymentActivites(params,callback);
            assert(callback.calledOnce);
            assert(callback.threw);
            next();
        });

	});
});
