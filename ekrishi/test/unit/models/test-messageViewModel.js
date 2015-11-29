/*global describe:true, it:true , beforeEach:true*/
'use strict';

var dConsts = require("../../../models/consts/dispute"),
	babelfish = require('../../../lib/babelfish'),
	should = require('should'),
	path = require('path'),
	MessageViewModel;

describe('MessageViewModel Tests', function() {

	var messageViewModel,
		req, data, formatter, model, makaraConfig;

	before(function() {
		MessageViewModel = require('../../../models/messageViewModel');
	});

	before(function(done) {

		req = {
			user: {
				accountNumber: 1234567890
			},
			session: {
				actionRequestor: dConsts.actionRequestor.seller
			},
			params: {
				txnId: "553022514C496572Y"
			},
			locality: {
				getCountrySpecifics: function() {
					return {
						countryCode: "US"
					}
				},
				culture: "en-US",
				locale: 'en_US'
			}
		};

		data = {
			"status": {
				"returnCode": "0"
			},
			"disputedItems": [],
			"previousRefunds": [],
			"transactionDetails": {
				"encryptedBuyerTransactionId": "4WC66280VA4209040",
				"disputedAmount": {
					"amount": -1516,
					"currencyCode": "USD",
					"unitAmount": -15.16,
					"currencyInfo": "US_Dollar"
				},
				"encryptedSellerTransactionId": "9J4537350G580372J"
			},
			"transaction": {
				"shippingInfo":{
					"shippingStatus":"shipped"
				}
			},
			"caseInfo": {
				"type": 10,
				"status": 20,
				"timeCreated": "1406286073",
				"timeClosed": "1407146887",
				"caseId": "PP-000-000-722-478",
				"disputeReason": [
					28,
					29,
					30,
					31
				],
				"snadBuyerPurchasedUrl": "http://ww.test.com/item1"
			},
			"caseOutcome": "6011046"
		};

		model = {
			buyer: {
				data: {
					success: true,
					errors: [],
				},
				seller: {
					data: {
						success: true,
						errors: [],
					}
				}
			}
		};

		formatter = {};

		makaraConfig = {
			fallback: 'en_US',
			contentRoot: path.join(process.cwd(), 'locales'),
			cache: true,
			enableHtmlMetadata: false
		};
		
		messageViewModel = new MessageViewModel(data, model, formatter);
		babelfish.middleman()(req, {}, done);

	});

	it('should load messageViewModel successfully', function(done) {
		//messageViewModel
		messageViewModel.data.should.have.property('caseInfo');
		should(messageViewModel.caseType).equal('snad');
		done();
	});

	it('should load dispute Reason successfully', function(done) {
		//messageViewModel
		var disputeReasonsSorted = ['Damaged','Different','Missing','Other'];
		messageViewModel.combineDisputeReasonsForContent(function(disputeReasons){			
			should(disputeReasons).equal('28');

		});
		done();
		
	});

	it('should load set Tracking info successfully', function(done) {
		//messageViewModel
		messageViewModel.setTrackingInfo(function(trackingInfo){			
			should(trackingInfo.status).equal('shipped');	
		});
		done();
		
	});


	// it('should fetch getDisputeReasons content successfully', function(done) {
	// 	//messageViewModel
	// 	messageViewModel.getDisputeReasons(req, function(err, disputeReasonContent) {
	// 		should.not.exist(err);
	// 		should(disputeReasonContent).equal('Item is damaged, different, missing parts, and more.');
	// 		done();
	// 	});
	// });
});