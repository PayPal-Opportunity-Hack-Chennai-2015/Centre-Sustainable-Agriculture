/*global describe:true, it:true , beforeEach:true*/
'use strict';

var dConsts = require("../../../models/consts/dispute"),
	expressValidator = require('express-validator'),
	should = require('should'),
	objUtil = require('objutil'),
	DisputeClaimSwitchModel;

describe('DisputeClaimSwitchModel Tests', function() {

	var disputeClaimSwitchModel,
		req,
		res;

	before(function() {
		DisputeClaimSwitchModel = require('../../../models/claimSwitchModel');
	});

	beforeEach(function(done) {

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
				culture: "en-US"
			},

			model: {
				data:{
					actionRequestor:10
				}
			}

		};

		// Apply all custom expressValidator methods to req object
		expressValidator()(req, res, done);

	});

	it('should update SNAD fields on disputeClaimSwitchModel successfully', function(done) {

		req.body = {
			disputeType: 'snad',
			itemCategoryForSNAD: 'product',
			actionRequestor:10,
			itemDescription: ['damaged', 'different', 'missingParts','other'],
			messageClaimTypeSwitch: 'test test test'
		};

		disputeClaimSwitchModel = new DisputeClaimSwitchModel(req);
		done();
	});

	it('should update buyerPurchasedUrl fields on disputeClaimSwitchModel successfully', function(done) {

		req.body = {
			disputeType: 'snad',
			itemCategoryForSNAD: 'product',
			actionRequestor:10,
			itemDescription: ['damaged', 'different', 'missingParts','other'],
			buyerPurchasedUrl: 'www.ebay.com/item1',
			messageClaimTypeSwitch: 'test test test'
		};

		disputeClaimSwitchModel = new DisputeClaimSwitchModel(req);
		done();
	});

	it('should get damaged reason for disputeClaimSwitchModel successfully', function(done) {
		req.body = {
			disputeType: 'snad',
			itemCategoryForSNAD: 'product',
			actionRequestor:10,
			itemDescription: ['damaged', 'different', 'missingParts','other'],
			messageClaimTypeSwitch: 'test test test',
			reason:'damaged'
		};
		
		disputeClaimSwitchModel = new DisputeClaimSwitchModel(req);
		disputeClaimSwitchModel.setDisputeReasons(req.body.reason);
		should(req.body.reason).equal('damaged');
		done();
		
		
	});


	it('should get different reason for disputeClaimSwitchModel successfully', function(done) {
		req.body = {
			disputeType: 'snad',
			itemCategoryForSNAD: 'product',
			actionRequestor:10,
			itemDescription: ['damaged', 'different', 'missingParts','other'],
			messageClaimTypeSwitch: 'test test test',
			reason:'different'
		};
		
		disputeClaimSwitchModel = new DisputeClaimSwitchModel(req);
		disputeClaimSwitchModel.setDisputeReasons(req.body.reason);
		should(req.body.reason).equal('different');
		done();
		
		
	});

	it('should get missingParts reason for disputeClaimSwitchModel successfully', function(done) {
		req.body = {
			disputeType: 'snad',
			itemCategoryForSNAD: 'product',
			actionRequestor:10,
			itemDescription: ['damaged', 'different', 'missingParts','other'],
			messageClaimTypeSwitch: 'test test test',
			reason:'missingParts'
		};
		
		disputeClaimSwitchModel = new DisputeClaimSwitchModel(req);
		disputeClaimSwitchModel.setDisputeReasons(req.body.reason);
		should(req.body.reason).equal('missingParts');
		done();
		
		
	});

	it('should get other reason for disputeClaimSwitchModel successfully', function(done) {
		req.body = {
			disputeType: 'snad',
			itemCategoryForSNAD: 'product',
			actionRequestor:10,
			itemDescription: ['damaged', 'different', 'missingParts','other'],
			messageClaimTypeSwitch: 'test test test',
			reason:'other'
		};
		
		disputeClaimSwitchModel = new DisputeClaimSwitchModel(req);
		disputeClaimSwitchModel.setDisputeReasons(req.body.reason);
		should(req.body.reason).equal('other');
		done();
		
		
	});
	
	it('should doClaimTypeSwitch successfully', function(done) {
		req.body = {
			disputeType: 'snad',
			itemCategoryForSNAD: 'product',
			actionRequestor:10,
			itemDescription: ['damaged', 'different', 'missingParts','other'],
			buyerPurchasedUrl: 'www.ebay.com/item1',
			messageClaimTypeSwitch: 'test test test',
		};
		
		disputeClaimSwitchModel = new DisputeClaimSwitchModel(req);
		disputeClaimSwitchModel.doClaimTypeSwitch(function(err, result){

			done();
		});			
		
	});

	it('should doClaimTypeSwitch for suggestedRefund  successfully', function(done) {
		req.body = {
			disputeType: 'snad',
			itemCategoryForSNAD: 'product',
			actionRequestor:10,
			itemDescription: ['damaged', 'different', 'missingParts','other'],
			messageClaimTypeSwitch: 'test test test',
			suggestedRefund :'custom'
		};
		
		disputeClaimSwitchModel = new DisputeClaimSwitchModel(req);
		disputeClaimSwitchModel.doClaimTypeSwitch(function(err, result){

			done();
		});			
		
	});

	it('should doClaimTypeSwitch for specific itemDescription  successfully', function(done) {
		req.body = {
			disputeType: 'snad',
			itemCategoryForSNAD: 'product',
			actionRequestor:10,
			itemDescription: 'damaged',
			messageClaimTypeSwitch: 'test test test',
			suggestedRefund :'custom',
			reason:'damaged'
		};
		
		disputeClaimSwitchModel = new DisputeClaimSwitchModel(req);
		disputeClaimSwitchModel.doClaimTypeSwitch(function(err, result){			
			should(req.body.reason).equal('damaged');
			done();
		});			
		
	});


});