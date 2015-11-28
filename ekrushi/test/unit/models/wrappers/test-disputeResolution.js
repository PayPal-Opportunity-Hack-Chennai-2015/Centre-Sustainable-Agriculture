/*global describe:true, it:true , beforeEach:true*/
'use strict';

var dConsts = require("../../../../models/consts/dispute"),
	should = require('should'), 
	DisputeResolution;

describe('Dispute Resolution Tests', function() {

	var req;


	before(function() {
		DisputeResolution = require('../../../../models/wrappers/disputeResolution');
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



	it('should open dispute successfully', function(done) {
		var transactionId = "553022514C496572Y",
		 input = {
			    "entityId": 1,
			    "userInfo": {
			    	"accountNumber":"2278764496903208703"
			    },
			    "actionRequestor": 10,
			    "transactionId": "96R95489RS677574U",
			    "disputePhase": 1,
			    "userMessage": "seller propose refund",
			    "itemCategory": 17,
			    "buyerPurchasedUrl": null,
			    "refundRequestAmount": null,
			    "disputedItems": [
			        {
			            "merchantSiteId": 1,
			            "itemCategory": 17,
			            "itemCost": {
			                "code": "USD",
			                "amount": "-1200"
			            },
			            "disputeReason": [
			                10
			            ],
			            "description": "seller propose refund",
			            "snadDisputeReasons": [
			                9
			            ],
			            "disputeReasonMessage": "seller propose refund"
			        }
			    ]
			};
					

		DisputeResolution.openDispute(transactionId, input, function(err, result) {
			done();
		});
			
	});	

	it('should update dispute successfully', function(done) {
		var input = {
			    "entityId": 1,
			    "userInfo": {
			    	"accountNumber":"2278764496903208703"
			    },
			    "actionRequestor": 10,
			    "transactionId": "96R95489RS677574U",
			    "disputePhase": 1,
			    "userMessage": "seller propose refund",
			    "itemCategory": 17,
			    "buyerPurchasedUrl": null,
			    "refundRequestAmount": null,
			    "disputedItems": [
			        {
			            "merchantSiteId": 1,
			            "itemCategory": 17,
			            "itemCost": {
			                "code": "USD",
			                "amount": "-1200"
			            },
			            "disputeReason": [
			                10
			            ],
			            "description": "seller propose refund",
			            "snadDisputeReasons": [
			                9
			            ],
			            "disputeReasonMessage": "seller propose refund"
			        }
			    ]
			};
					

		DisputeResolution.updateDisputeItems(input, function(err, result) {
			done();
		});
			
	});	

	it('should check for dispute is allowed successfully', function(done) {
		var transactionId = "553022514C496572Y",
		input = {
			    "entityId": 1,
			    "transactionId": "96R95489RS677574U",
			    "itemCategory": 17,
				"userInfo":{
					"actorInfoVO": {
					"token": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48VXNlcl9Vc2VyQXV0aFRva2VuVk8gaWQ9IjEiPjxhY2NvdW50X251bWJlciB0eXBlPSJ1aW50NjQiPjE3NTQzNzA3NDE5MTU0NDU3MDE8L2FjY291bnRfbnVtYmVyPjxsb2dpbl9pZCB0eXBlPSJ1aW50NjQiPjIxODgyODwvbG9naW5faWQ+PHNlc3Npb25fbnVtYmVyIHR5cGU9InVpbnQzMiI+MTk4Nzk0OTI8L3Nlc3Npb25fbnVtYmVyPjxzZXNzaW9uX3RpbWUgdHlwZT0idWludDMyIj4xMzkyNzAxNjc5PC9zZXNzaW9uX3RpbWU+PGF1dGhfdHlwZSB0eXBlPSJzaW50OCI+ODA8L2F1dGhfdHlwZT48c2Vzc2lvbl9pZCB0eXBlPSJTdHJpbmciPlNSRll2QVFKVEFJQTwvc2Vzc2lvbl9pZD48YXV0aF9jcmVkZW50aWFsIHR5cGU9InNpbnQ4Ij44MDwvYXV0aF9jcmVkZW50aWFsPjxhdXRoX21vZGlmaWVyX2ZsYWdzIHR5cGU9InVpbnQzMiI+MTwvYXV0aF9tb2RpZmllcl9mbGFncz48YXV0aF9sZXZlbCB0eXBlPSJ1aW50MzIiPjA8L2F1dGhfbGV2ZWw+PHRva2VuX3N0YXR1cyB0eXBlPSJzaW50OCI+ODk8L3Rva2VuX3N0YXR1cz48Y2hhbm5lbCB0eXBlPSJTdHJpbmciPldFQjwvY2hhbm5lbD48c2VjdXJpdHlfbmFtZXNwYWNlIHR5cGU9IlN0cmluZyI+V0VCPC9zZWN1cml0eV9uYW1lc3BhY2U+PC9Vc2VyX1VzZXJBdXRoVG9rZW5WTz4=",
					"visitorId": "0",
					"actorAccountNumber": "1754370741915445701",
					"actorId": "218828",
					 "actorAuthType": 80,
					"actorIpAddr": "127.0.0.1",
					"tokenType": 0,
					"entryPoint": "http: //uri.paypal.com/Web/Web/MyTestSpartaApp",
					"actorSessionId": "SRFYvAQJTAIA",
					"guid": "0",
					"actorType": 2,
					"actorAuthCredential": 80,
					"actorRiskDetails": {}
				    }
				}
			}

					
		DisputeResolution.checkIsDisputeAllowed(transactionId, input, function(err, result) {
			done();
		});
			
	});	

	it('should open billing dispute successfully', function(done) {
		var transactionId = "553022514C496572Y",
		input = {
			    "entityId": 1,			    
			    "userInfo":{
			    	"accountNumber":"2278764496903208703"
				},
				"actionRequestor": 10,
				"transactionId": transactionId,
				"billingDisputeDetails" :{}
			}

					
		DisputeResolution.openBillingDispute(transactionId, input, function(err, result) {
			done();
		});
			
	});	

});