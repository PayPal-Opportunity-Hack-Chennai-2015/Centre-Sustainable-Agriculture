/*global describe:true, it:true , beforeEach:true*/
'use strict';

var dConsts = require("../../../../models/consts/dispute"),
	should = require('should'), 
	DisputeCoreIntegrationServ;

describe('Dispute Core Integration Serv Tests', function() {

	var req;


	before(function() {
		DisputeCoreIntegrationServ = require('../../../../models/wrappers/disputeCoreIntegration');
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



	it('should calculate fee amount for offer successfully', function(done) {
		var input = {
				    "feeAmountToCalculate": {
				        "amount": "1000",
				        "code": "USD"
				    },
				    "encryptedTransactionId": "66A461319B088441P"
				}

		DisputeCoreIntegrationServ.calculateFeeAmount(input, function(err, result) {
			should.not.exist(err);
			should(result.body.result.responseStatus.returnCode).equal('0');
			done();
		});
			
	});	


});