/*global describe:true, it:true , beforeEach:true*/
'use strict';

var dConsts = require("../../../models/consts/dispute"),
	should = require('should'),
	MessageModel;

describe('MessageModel Tests', function() {

	var messageModel,
		req;


	before(function() {
		MessageModel = require('../../../models/messageModel');
	});

	beforeEach(function() {

		req = {
			user: {
				accountNumber: 1234567890,
				actorInfoVO: {
					actorAccountNumber: "2139379595557968797",
					actorId: "1234",
					actorRiskDetails: {}
				}
			},
			session: {
				actionRequestor: dConsts.actionRequestor.seller
			},
			params: {
				txnId: "553022514C496572Y",
				caseId: "PP-000-000-710-094"
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

		messageModel = new MessageModel(req);
	});

	it('should load message model successfully', function(done) {

		messageModel.load(function(err, result) {
			should.not.exist(err);
			result.should.have.property('messageViewModel');
			should(result.transactionId).equal(req.params.txnId);
			done();
		});

	});

});