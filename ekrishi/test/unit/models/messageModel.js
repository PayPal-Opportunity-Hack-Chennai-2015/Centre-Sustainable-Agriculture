'use strict';

var assert = require('chai').assert,
	proxyquire = require('proxyquire').noCallThru(),
	dConsts = require("../../../models/consts/dispute");

describe('messageModel', function() {
	var data = {
			disputeMessages: []
		},
		req = {
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
			locality: {
				getCountrySpecifics: function() {
					return {
						countryCode: "US"
					}
				},
				culture: "en-US"
			}
		},
		messageModel;

	before(function() {
		messageModel = proxyquire('../../../models/messageModel', {
			"./wrappers/disputeResolution": {},
			"./wrappers/disputeCore": {},
			"./wrappers/userRead": {},
			"locale": {
				formatter: function() {
					return;
				}
			},
			"./wrappers/disputeRead": {
				getDisputeMessages: function(input, callback) {
					callback(null, {
						statusCode: 200,
						body: {
							result: {
								"errorCode": 0,
								"disputeMessages": [{
									"message": "asdfasdf",
									"timeCreated": "1393870534",
									"association": 1
								}, {
									"message": "Buyer message number two",
									"timeCreated": "1393870945",
									"association": 1
								}, {
									"message": "Test message for refunding for a dispute",
									"timeCreated": "1393871259",
									"association": 2
								}, {
									"message": "WS_Dispute_Comment_Seller_Issued_Refund",
									"timeCreated": "1393871259",
									"association": 5
								}]
							}
						}
					});
				}
			}
		});
	});

	it('should correctly set view model flags for close+refund use case', function(next) {
		var m = new messageModel(req),
			params = {
				actionRequestor: dConsts.actionRequestor.seller,
				actorId: 43153253245,
				caseId: "PP-000-000-704-286",
				transactionId: "553022514C496572Y"
			};
		m.getMessages(params, function(err, result) {
			assert.notOk(err);
			assert.isFalse(result.caseState.isCaseOpen);
			assert.isTrue(result.caseState.isRefundCase);
			assert.equal(result.disputeMessages.length, 4);
			next();
		});
	});
});