/*global describe:true, it:true , beforeEach:true*/
'use strict';

var dConsts = require("../../../models/consts/dispute"),
	should = require('should'),
	DisputeModel;

describe('DisputeModel Tests', function() {

	var disputeModel,
		req;

	before(function() {
		DisputeModel = require('../../../models/disputeModel');
	});

	beforeEach(function() {

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

		disputeModel = new DisputeModel(req);
	});

	it('should load getSenderTransactionDetails successfully', function(done) {

		disputeModel.load(function(err, result) {
			should.not.exist(err);
			result.should.have.property('disputeViewModel');
			should(result.transactionId).equal(req.params.txnId);		
			done();
		});

	});

});