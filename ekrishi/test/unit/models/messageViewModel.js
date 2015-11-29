'use strict';

var assert = require('chai').assert,
	sinon = require('sinon');

describe('messageViewModel', function () {
	var data = {
		disputeMessages: [],
		transaction: {},
		caseInfo: {
			disputeReason: [1]
		}
	}, models = {
		buyer: {},
		seller: {}
	},
	messageViewModel = require('../../../models/messageViewModel');

	beforeEach(function (next) {
		data.disputeMessages = [
			{
				"message": "Buyer message number one",
				"timeCreated": "1393870534",
				"association": 1
			},
			{
				"message": "Buyer message number two",
				"timeCreated": "1393870945",
				"association": 1
			},
			{
				"message": "Seller message for refunding for a dispute",
				"timeCreated": "1393871259",
				"association": 2
			},
			{
				"message": "WS_Dispute_Comment_Seller_Issued_Refund",
				"timeCreated": "1393871259",
				"association": 5
			}
		];
		next();
	});

	it('should correctly set default state flags (open and non-refunded)', function (next) {
		var m = new messageViewModel(data, models);
		assert.isTrue(m.isCaseOpen);
		assert.isFalse(m.isRefunded);
		assert.equal(m.disputeMessages.length, 4);
		next();
	});

	it('should correctly enable case escalation for buyer if the transaction is > 7 days', function (next) {
		var clock = sinon.useFakeTimers(new Date("2014-12-29").getTime());
		data.transaction.timeCreated = Math.round(new Date("2014-12-27").getTime() / 1000);

		// Inside the 7 day window
		var m = new messageViewModel(data, models);
		assert.isFalse(m.canEscalateToPaypal);

		// Outside the 7 day window... in the wrong direction
		clock = sinon.useFakeTimers(new Date("2014-12-15").getTime());
		m = new messageViewModel(data, models);
		assert.isFalse(m.canEscalateToPaypal);

		// Outside the 7 day window and over a new year
		clock = sinon.useFakeTimers(new Date("2015-1-5").getTime());
		m = new messageViewModel(data, models);
		assert.isTrue(m.canEscalateToPaypal);

		clock.restore();
		next();
	});
});