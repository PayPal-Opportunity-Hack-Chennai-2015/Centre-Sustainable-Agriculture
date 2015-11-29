'use strict';

var assert = require('chai').assert,
	proxyquire = require('proxyquire').noCallThru(),
    clone= require('clone'),
    sinon = require('sinon'),
    should = require('should'),
    metadata= require('g11n-metadata'),
    griffin= require('griffin').useFeature('date').useFeature('number').useMetadata(metadata),
    _ = require('underscore'),
    transactionResponse= require('../../data/transactionResponse.json'),
    paymentActivities= require('../../data/paymentActivities.json'),
	TransactionDetailsModel = proxyquire('../../../../models/achcb/transactionDetailsModel', {
		"../wrappers/walletActivityDetailsServ": function(req){
			this.loadTransactionDetails = function(params,callback){
				callback(null,clone(transactionResponse));
			};
		},
		"../userModel": {},
		"../wrappers/activitySearchServ": function(req){
            this.findPaymentActivites= function(params,callback){
                callback(null,clone(paymentActivities));
            }
        }
	}),
	dConsts = require("../../../../models/consts/dispute");

describe('transactionDetailsModel', function () {
	var req = {
		user: {
			accountNumber: 1234567890
		},
		session: {
			actionRequestor: dConsts.actionRequestor.seller
		},
		params: {
			caseId: "PP-000-000-704-286",
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
        }
	};
    var transactionDetailsModel= null;

    before(function (next) {
        next();
    });


	it('should create a transactionDetailsModel', function (next){
		transactionDetailsModel = new TransactionDetailsModel(req);
		next();
	});

	describe('#loadTransaction', function () {

        before(function (next) {
            griffin.useFeature('number');
            req.locality.griffen= griffin.createHandler(req.locality.culture, req.locality.country);
            transactionDetailsModel = new TransactionDetailsModel(req);
            transactionDetailsModel.griffinHandler= req.locality.griffen;
            next();
        });

		it('should fetch transaction details', function (next){
			function callback(err,response){
                response.should.have.property('transactionId').with.not.empty;
                response.should.have.property('createdDate').with.not.empty;
                response.should.have.property('grossAmountWithCurrency').with.not.empty;
                response.should.have.property('transactionStatus').with.not.empty;
                response.should.have.property('counterpartyEmail').with.not.empty;
                response.should.have.property('shipping');
                response.should.have.property('posInfo');
                response.should.have.property('refundInfo');
                next();
			};
            var callback = sinon.spy(callback);
			transactionDetailsModel.loadTransaction({},callback);
            assert(callback.calledOnce);
			//next();
		});

        it('should fetch transaction details with Shipping info', function (next){

            var transactionResponseWithShipping = clone(transactionResponse);
            _.extend(transactionResponseWithShipping,{
                "shipping": [
                    {
                        "tracking_number": "12345",
                        "mailing_time": "2012-02-15T19:27:53Z",
                        "destination": {
                            "destination_address": {
                                "line1": "272807 Avenida de las Flores",
                                "line2": "82563 Charlois Blvd",
                                "city": "Ventura",
                                "state": "CA",
                                "postal_code": "93003",
                                "country_code": "US",
                                "addressee_name": "Joe's Generic Business"
                            },
                            "is_confirmed": true
                        },
                        "carrier": "USPS"
                    }
                ]
            });
            function callback(err,response){
                response.should.have.property('shipping').with.not.empty;
                next();
            };
            sinon.stub(transactionDetailsModel.walletActivityDetailsServ, "loadTransactionDetails").callsArgWith(1,null,transactionResponseWithShipping);
            var callback = sinon.spy(callback);
            transactionDetailsModel.loadTransaction({},callback);
            assert(callback.calledOnce);
            //next();
        });

        it('should fetch transaction details with Refund info', function (next){
            transactionDetailsModel = new TransactionDetailsModel(req);
            transactionDetailsModel.griffinHandler= req.locality.griffen;
            var transactionResponseWithRefund = clone(transactionResponse);
            _.extend(transactionResponseWithRefund,{
                "related_activities": [
                    {
                        "id": "1HC56546C8783250U",
                        "type": "PAYMENT_RECEIVED",
                        "amount": {
                            "gross": {
                                "value": "8.00",
                                "currency_code": "USD"
                            },
                            "net": {
                                "value": "7.47",
                                "currency_code": "USD"
                            },
                            "fee": {
                                "value": "0.53",
                                "currency_code": "USD"
                            }
                        },
                        "time": {
                            "created": "2006-03-25T01:26:34Z",
                            "updated": "2006-03-25T01:29:05Z"
                        },
                        "status": "REFUNDED",
                        "debit_credit_code": "CREDIT",
                        "link": "/v1/payments/activities/1HC56546C8783250U"
                    },
                    {
                        "id": "5XE73345UY878860P",
                        "type": "REFUND",
                        "amount": {
                            "gross": {
                                "value": "0.06",
                                "currency_code": "USD"
                            },
                            "net": {
                                "value": "0.06",
                                "currency_code": "USD"
                            },
                            "fee": {
                                "value": "0.00",
                                "currency_code": "USD"
                            }
                        },
                        "time": {
                            "created": "2006-03-25T01:29:05Z",
                            "updated": "2006-03-25T01:29:05Z"
                        },
                        "status": "COMPLETED",
                        "debit_credit_code": "CREDIT",
                        "link": "/v1/payments/activities/5XE73345UY878860P"
                    }
                ]
            });
            function callback(err,response){
                response.should.have.property('refundInfo').with.not.empty;
                next();
            };
            sinon.stub(transactionDetailsModel.walletActivityDetailsServ, "loadTransactionDetails").callsArgWith(1,null,transactionResponseWithRefund);
            var callback = sinon.spy(callback);
            transactionDetailsModel.loadTransaction({isConsumer: true},callback);
            assert(callback.calledOnce);
            //next();
        });

        it('should fetch transaction details with POS info', function (next){
            transactionDetailsModel = new TransactionDetailsModel(req);
            transactionDetailsModel.griffinHandler= req.locality.griffen;
            var transactionResponseWithPOS = clone(transactionResponse);
            _.extend(transactionResponseWithPOS,{
                "channel": {
                    "pos": {
                        "store": {
                            "name": "Apple Store",
                            "address": {
                                "line1": "401 W 14th Street",
                                "city": "New York",
                                "state": "NY",
                                "postal_code": "10014",
                                "country_code": "US"
                            },
                            "id": "APP112",
                            "cashier_name": "Dayanand",
                            "cashier_id": "22563",
                            "terminal_id": "1002",
                            "tagline": "Thank you for visiting our store",
                            "description": "Cash and Carry",
                            "manager_name": "Priyanka",
                            "business_logo": "http://www.justoner.com/apple1-logo.jpg",
                            "location_name": "NY",
                            "phones": [
                                {
                                    "country_code": "212",
                                    "number": "444-3400"
                                }
                            ]
                        },
                        "delivery_address": {
                            "line1": "line1",
                            "line2": "line2",
                            "city": "city",
                            "state": "state",
                            "postal_code": "12345",
                            "country_code": "US"
                        },
                        "split_tenders": [
                            {
                                "name": "Cash!!!",
                                "amount": {
                                    "value": "300.00",
                                    "currency_code": "USD"
                                }
                            }
                        ],
                        "retailer_transaction_id": "10223341",
                        "barcode_number": "988456331277",
                        "barcode_type": "CODE-128",
                        "return_policy": "All merchandise sold and shipped by Metro.com may be returned either to a store or by mail within 90 days",
                        "receipt_message": "retailerReceiptData"
                    }
                },
                "channels": [
                    "POINT_OF_SALE"
                ]
            });
            function callback(err,response){
                response.should.have.property('posInfo').with.not.empty;
                next();
            };
            sinon.stub(transactionDetailsModel.walletActivityDetailsServ, "loadTransactionDetails").callsArgWith(1,null,transactionResponseWithPOS);
            var callback = sinon.spy(callback);
            transactionDetailsModel.loadTransaction({},callback);
            assert(callback.calledOnce);
            //next();
        });
	});
    describe('#fetchPaymentActivities', function () {
        it('should fetch payment activities', function (next){
            transactionDetailsModel = new TransactionDetailsModel(req);
            transactionDetailsModel.griffinHandler= req.locality.griffen;
            function callback(err,response){
                response.should.not.empty;
                next();
            };
            var callback = sinon.spy(callback);
            transactionDetailsModel.fetchPaymentActivities({},callback);
            assert(callback.calledOnce);
        });
    });
});