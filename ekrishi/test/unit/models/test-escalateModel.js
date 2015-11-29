/*global describe:true, it:true , beforeEach:true*/
'use strict';

var dConsts = require("../../../models/consts/dispute"),
	should = require('should'),
	EscalateModel;

describe('EscalateModel Tests', function () {

	var escalateModel,
		req;

	before(function () {
		EscalateModel = require('../../../models/escalateModel');
	});

	beforeEach(function () {

		req = {
			user: {
				accountNumber: 1234567890
			},
			params: {
				caseId: "PP-000-000-710-094",
				txnId: "553022514C496572Y"
			},
			locality: {
				getCountrySpecifics: function() {
					return {
						countryCode: "US"
					}
				},
				culture: "en-US"
			},
			body: {}
		};

		escalateModel = new EscalateModel(req);
	});

	it('should call doEscalation successfully', function (done) {

		var params = {
			actorId: "2073758560206080108",
			actionRequestor: 10,
			caseId: "PP-000-000-699-816",
			escalationReason: 4,
			noteToPaypal: "test test test"
		};

		escalateModel.doEscalation(params, function (err, response) {
			should.not.exist(err);
			response.should.have.property('status');
			should(response.status.returnCode).equal('0');
			done();
		});

	});

});