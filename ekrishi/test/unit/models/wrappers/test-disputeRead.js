/*global describe:true, it:true , beforeEach:true*/
'use strict';

var dConsts = require("../../../../models/consts/dispute"),
	should = require('should'), 
	DisputeRead;

describe('Dispute Read Tests', function() {

	var req;


	before(function() {
		DisputeRead = require('../../../../models/wrappers/disputeRead');
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



	it('should check for case creation permitted successfully', function(done) {
		var txnIds ="553022514C496572Y";
		var input = {	
					"requestedCaseType":"INR",	    
				    "txnId": [txnIds]
				}

		DisputeRead.isCaseCreationPermitted(input, function(err, result) {
			should.not.exist(err);
			done();
		});
			
	});	

	it('should check for case creation permitted successfully :case 2', function(done) {
		var txnIds ="553022514C496572Y";
		var input = {	
					"requestedCaseType":"SNAD",	    
				    "txnId": txnIds
				}

		DisputeRead.isCaseCreationPermitted(input, function(err, result) {
			should.not.exist(err);
			done();
		});
			
	});

	it('should get data for billing disputes', function(done) {
		var input = {	
					"userInfo":{
						"actorInfoVO":{
							"actorAccountNumber": "2139379595557968797",
							"actorId": "1234",
							"actorRiskDetails": {}
						}
					}, 
				 	"caseId": "PP-000-000-710-094"
				}
		DisputeRead.getBillingDisputes(input, function(err, result) {
			should.not.exist(err);
			done();
		});
			
	});	

});