'use strict';

var _ = require('lodash');

exports.layout = {
	cookieEncryptionKey: '1h1P/y6F/kg6OlM7oeTms2Yr6Lw=',
	cookieMacKey: 'SF4HNI/A1U3xPww2eylPqJNQIvU='
};


exports.middleware = function(req, res, next) {

	req.appName = 'rescenternodeweb';

	req.log = function(level, message) {
		console.log(level + ' ' + JSON.stringify(message));
	};

	res.locals = {};

	req.session = req.session || {};

	req.session.regenerate = function(fn) {
		return fn.call(null);
	};

	req.session.save = function(fn) {
		return fn.call(null);
	};

	
	req.locality = {
		timezone: 'America/Los_Angeles',
		country: 'US',
		locale: 'en_US',
		culture: 'en-US',
		language: 'en',
		directionality: 'ltr',
		getCountrySpecifics: function(fn) {
			return fn.call(null);
		}
	}


	if (!_.contains(['/login', '/'], req.path)) {
		req.user = {
			firstName: "John",
			lastName: "MM",
			legalCountry: "US",
			country: "US",
			accountNumber: "2073758560206080108",
			encryptedAccountNumber: "5RN3NUZF6S578",
			accountVO: {
				accountNumber: "2073758560206080108",
				encryptedAccountNumber: "5RN3NUZF6S578",
				userFlags: [{
					_type: "User::UserFlagsVO",
					flagGroupId: "1001",
					flagGroupValue: "34832"
				}]
			},
			actorInfoVO: {
				actorAccountNumber: "2139379595557968797",
				actorId: "1234",
				actorRiskDetails: {}
			}
		};
		req.securityContext = {
			actor: {
				account_number: "2139379595557968797",
				id: "1234"
			}
		}
	}

	if (_.contains(['/resolutioncenter/done', '/resolutioncenter/refundConfirm', '/resolutioncenter/refundComplete'], req.path)) {
		req.session.txnId = '3JL3910102390602W';

		if (_.contains(['/resolutioncenter/refundConfirm', '/resolutioncenter/refundComplete'], req.path)) {
			req.session.refund = req.session.refund || {};
			req.session.refund.txnId = '3JL3910102390602W';
			req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		}
	}

	// Escalate has a typical use case. Even if user directly enters escalate url, we will redirect them to message board
	// then he/she has to click escalate link in message board page.
	if (_.contains(['/resolutioncenter/escalate/3JL3910102390602W/PP-000-000-710-094',
			'/resolutioncenter/resolve/3JL3910102390602W/PP-000-000-710-094',
			'/resolutioncenter/escalate',
			'/resolutioncenter/resolve'
		], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'inr';

		if (_.contains(['/resolutioncenter/escalate', '/resolutioncenter/resolve'], req.path)) {
			req.session.txnId = '3JL3910102390602W';
		}
	}

	/* claim type switch */

	if (_.contains(['/resolutioncenter/claimtypeswitch/9JL3910102390602W/PP-000-000-710-094', 'resolutioncenter/claimtypeswitch'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'inr';


		if (_.contains(['/resolutioncenter/claimtypeswitch'], req.path)) {
			req.session.txnId = '9JL3910102390602W';
		}

	}

	/* remittance pages */


	if (_.contains(['/resolutioncenter/remittance/dispute','/resolutioncenter/remittance/createcase/1RM0000000000002W'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'snad';
	}

	// for snad message board


	if (_.contains(['/resolutioncenter/messages/3JL0000000000002W/PP-000-000-710-094'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'snad';
	}

	if (_.contains(['/resolutioncenter/messages/2JL0000000000002W/PP-000-000-710-094'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'snad';
		req.session.showCalculateFeeError = true;
	}

	// for send propose refund offer page
	if (_.contains(['/resolutioncenter/messages/sendoffer/confirm/4JL0000000000002W/PP-000-000-710-094'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'snad';
		req.session.actAsProposeOffer = true;
	}

	// for send accept offer refund offer page
	if (_.contains(['/resolutioncenter/messages/sendoffer/confirm/5JL0000000000002W/PP-000-000-710-094'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'snad';
		req.session.actAsAcceptOffer = true;
	}

	if (_.contains(['/resolutioncenter/messages/sendoffer/confirm/6JL0000000000002W/PP-000-000-710-094'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'snad';
		req.session.actAsMessage = true;
	}

	/* Seller Propose for the Buyer Requested amount */

	if (_.contains(['/resolutioncenter/messages/sendoffer/confirm/7JL0000000000002W/PP-000-000-710-094'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'snad';
		req.session.sellerProposedRefund = true;
	}

	if (_.contains(['/resolutioncenter/messages/sendoffer/confirm/8JL0000000000002W/PP-000-000-710-094'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'snad';
		req.session.actAsAcceptOffer = true;
		req.session.fastTrackMessage ='fast track message';
	}

	if (_.contains(['/resolutioncenter/messages/sendoffer/confirm/9JL0000000000002W/PP-000-000-710-094'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'snad';
		req.session.actAsAcceptOffer = true;
		req.session.messageBodyForSellerOffer ='message for seller propose offer';
	}


	if (_.contains(['/resolutioncenter/messages/sendoffer/confirm/1AB0000000000002W/PP-000-000-710-094'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'snad';
		req.session.sellerProposedRefund = true;
		req.session.offerType = 'return';
	}

	/* fast track message board */
	if (_.contains(['/resolutioncenter/messages/fasttrack/confirm/3JL0000000000002W/PP-000-000-710-094'], req.path)) {
		req.session.currentCase = require('../../mocks/dummyData/currentCase.json');
		req.session.currentCase.caseType = 'snad';
		req.session.buyerRequestedRefundAmountPlain = {};
	}

	next();
};