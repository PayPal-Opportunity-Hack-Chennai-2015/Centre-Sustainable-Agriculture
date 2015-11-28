/*global describe:true, it:true , beforeEach:true*/
'use strict';

var dConsts = require("../../../models/consts/dispute"),
	expressValidator = require('express-validator'),
	should = require('should'),
	objUtil = require('objutil'),
	DisputeResolutionModel;

describe('DisputeResolutionModel Tests', function() {

	var disputeResolutionModel,
		req,
		res;

	before(function() {
		DisputeResolutionModel = require('../../../models/disputeResolutionModel');
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
			}
		};

		// Apply all custom expressValidator methods to req object
		expressValidator()(req, res, done);

	});

	it('should update INR fields on disputeResolutionModel successfully', function(done) {

		req.body = {
			disputeType: 'inr',
			itemCategoryForINR: 'product',
			messageBodyForInr: 'test test test'
		};

		disputeResolutionModel = new DisputeResolutionModel(req);
		should(disputeResolutionModel.disputeType).equal('inr');
		should(disputeResolutionModel.itemCategory).equal(17);
		done();
	});

	it('should update SNAD fields on disputeResolutionModel successfully', function(done) {

		req.body = {
			disputeType: 'snad',
			itemCategoryForSNAD: 'product',
			itemDescription: ['damaged', 'different', 'missingParts','other'],
			suggestedRefund: 5,
			buyerPurchasedUrl: 'www.ebay.com/item1',
			messageBodyForSnad: 'test test test'
		};

		disputeResolutionModel = new DisputeResolutionModel(req);
		should(disputeResolutionModel.disputeType).equal('snad');
		should(disputeResolutionModel.itemCategory).equal(17);
		done();
	});

	it('should create dispute model for INR successfully', function(done) {

		req.body = {
			disputeType: 'inr',
			itemCategory: 'product',
			messageBodyForInr: 'test test test'
		};

		disputeResolutionModel = new DisputeResolutionModel(req);

		disputeResolutionModel.createDispute(function(err, response) {
			should.not.exist(err);
			response.body.result.should.have.property('caseId');
			done();
		});

	});

	it('should create dispute model for SNAD successfully', function(done) {

		req.body = {
			disputeType: 'snad',
			itemCategory: 'product',
			itemDescription: ['damaged', 'different', 'missingParts','other'],
			suggestedRefund: 5,
			buyerPurchasedUrl: 'www.ebay.com/item1',
			messageBodyForSnad: 'test test test'
		};

		disputeResolutionModel = new DisputeResolutionModel(req);

		disputeResolutionModel.createDispute(function(err, response) {
			should.not.exist(err);
			response.body.result.should.have.property('caseId');
			done();
		});

	});

	it('should update OTHER fields on disputeResolutionModel successfully', function(done) {

		req.body = {
			disputeType: 'other',
			itemCategoryForOTHER: 'product',
			itemDescription: ['damaged', 'different', 'missingParts','other'],
			suggestedRefund: 5,
			buyerPurchasedUrl: 'www.ebay.com/item4',
			messageBodyForOther: 'test test test'
		};

		disputeResolutionModel = new DisputeResolutionModel(req);
		should(disputeResolutionModel.disputeType).equal('other');
		done();
	});

	it('should check Open Dispute for Other successfully', function(done) {

		req.body = {
			disputeType: 'other',
			messageBodyForOther: 'test test test'
		};
		var input ={
			userMessage:'test test',
			userInfo: 'data',
			disputedItems:{}
		}

		disputeResolutionModel = new DisputeResolutionModel(req);

		disputeResolutionModel.openDispute(input, function(err, response) {
			should.exist(err);
			done();
		});

	});

});