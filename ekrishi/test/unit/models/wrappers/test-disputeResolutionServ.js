/*global describe:true, it:true , beforeEach:true*/
'use strict';

var dConsts = require("../../../../models/consts/dispute"),
	should = require('should'), 
	DisputeResolutionServ;

describe('Dispute Resolution Serv Tests', function() {

	var req;


	before(function() {
		DisputeResolutionServ = require('../../../../models/wrappers/disputeResolutionServ');
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
	});



	it('should send message for propose offer with no return and no replace', function(done) {

		var input = {
				    actor_details: {
				        entity: "PAYPAL",
				        actor_type: "1",
				        login_id: "8573727",
				        account_number: "2278764496903208703"
				    },
				    notes: "decline offer",
				    amount: {
				        value: "800",
				        currency: "USD"
				    },
				    return_item: false,
					replace_item: false,
					invoice_id: "1234567890",
				    disputeId: "PP-000-000-710-094"
				}
		DisputeResolutionServ.proposePartialRefund(input, function(err, result) {
			should.not.exist(err);
			should(result.body.response_status).equal('0');
			done();
		});
			
	});

	it('should send message for propose offer with return', function(done) {

		var input = {
				    actor_details: {
				        entity: "PAYPAL",
				        actor_type: "1",
				        login_id: "8573727",
				        account_number: "2278764496903208703"
				    },
				    notes: "decline offer",
				    amount: {
				        value: "800",
				        currency: "USD"
				    },
				    return_item: true,
					replace_item: false,
					invoice_id: "1234567890",
				    disputeId: "PP-000-000-710-094"
				}
		DisputeResolutionServ.proposePartialRefund(input, function(err, result) {
			should.not.exist(err);
			should(result.body.response_status).equal('0');
			done();
		});
			
	});

	it('should send message for propose offer with replace', function(done) {

		var input = {
				    actor_details: {
				        entity: "PAYPAL",
				        actor_type: "1",
				        login_id: "8573727",
				        account_number: "2278764496903208703"
				    },
				    notes: "decline offer",
				    amount: {
				        value: "800",
				        currency: "USD"
				    },
				    return_item: false,
					replace_item: true,
					invoice_id: "1234567890",
				    disputeId: "PP-000-000-710-094"
				}
		DisputeResolutionServ.proposePartialRefund(input, function(err, result) {
			should.not.exist(err);
			should(result.body.response_status).equal('0');
			done();
		});
			
	});


	it('should send message for decline offer', function(done) {

		var input = {
				    actor_details: {
				        entity: "PAYPAL",
				        actor_type: "1",
				        login_id: "8573727",
				        account_number: "2278764496903208703"
				    },
				    notes: "decline offer",
				    amount: {
				        value: "800",
				        currency: "USD"
				    },
				    disputeId: "PP-000-000-710-094"
				}
		DisputeResolutionServ.denyPartialRefund(input, function(err, result) {
			should.not.exist(err);
			should(result.body.response_status).equal('0');
			done();
		});
			
	});

	it('should send message for accept offer', function(done) {

		var input = {
				    actor_details: {
				        entity: "PAYPAL",
				        actor_type: "1",
				        login_id: "8573727",
				        account_number: "2278764496903208703"
				    },
				    notes: "accept offer",
				    amount: {
				        value: "800",
				        currency: "USD"
				    },
				    disputeId: "PP-000-000-710-094"
				}
		DisputeResolutionServ.acceptPartialRefund(input, function(err, result) {
			should.not.exist(err);
			should(result.body.response_status).equal('0');
			done();
		});
			
	});

	it('should update the photo evidence email successfully', function(done) {

		var input = {
				    actor_details: {
				        entity: "PAYPAL",
				        actor_type: "1",
				        login_id: "8573727",
				        account_number: "2278764496903208703"
				    },
				    photo_evidence_email: "someone@gmail.com",
					seller_notes: "notes for photo evidence",
				    disputeId: "PP-000-000-710-094"
				}
		DisputeResolutionServ.updateMerchandiseDispute(input, function(err, result) {
			should.not.exist(err);
			should(result.body.response_status).equal('0');
			done();
		});
			
	});

});