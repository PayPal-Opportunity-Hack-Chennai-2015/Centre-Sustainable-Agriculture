'use strict';

var assert = require('chai').assert,
	proxyquire = require('proxyquire').noCallThru(),
    servicecore = require('servicecore'),
    clone= require('clone'),
    sinon = require('sinon'),
    should = require('should'),
    querystring = require('querystring'),
    _ = require('underscore'),
    transactionResponse= require('../../../data/transactionResponse.json'),
    WalletActivityDetailsServ = require('../../../../../models/wrappers/walletActivityDetailsServ'),
	dConsts = require("../../../../../models/consts/dispute");

describe('WalletActivityDetailsServ', function () {
	var req = {
		user: {
			accountNumber: 1234567890,
            actorInfoVO: {
                actorId: '217830',
                actorPartyId: '0'
            }
		},
		session: {
			actionRequestor: dConsts.actionRequestor.seller
		},
		params: {
			caseId: "PP-000-000-704-286",
			txnId: "553022514C496572Y"
		}
	};
    var walletActivityDetailsServ= null;

    before(function (next) {
        next();
    });


	it('should create a WalletActivityDetailsServ wrapper', function (next){
        walletActivityDetailsServ = new WalletActivityDetailsServ(req);
		next();
	});

	describe('#loadTransactionDetails', function () {

        before(function (next) {
            next();
        });

		it('should load the transaction details', function (next){

            walletActivityDetailsServ = new WalletActivityDetailsServ(req);

            var params={
                'transactionId': '5JV33043GP8569220'
            };

            var walletActivityDetailsServMock = {
                request: function(requestJSON,callback){
                    assert(requestJSON.path.indexOf(params.transactionId)!= -1);
                    callback(null,{body: clone(transactionResponse)});
                }
            };
            servicecore.create.restore();
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('walletactivitydetailsserv').returns(walletActivityDetailsServMock);
            function callback(err,response){
                response.should.not.empty;
                next();
            };
            walletActivityDetailsServ.loadTransactionDetails(params,callback);
		});

        it('should throw error if there is an error response', function (next){

            walletActivityDetailsServ = new WalletActivityDetailsServ(req);

            var params={
                'transactionId': '5JV33043GP8569220'
            };

            var walletActivityDetailsServMock = {
                request: function(requestJSON,callback){
                    try{
                        throw new Error();
                    }catch(err){
                        callback(err);
                    }
                }
            };
            servicecore.create.restore();
            var servicecoreServStub = sinon.stub(servicecore,'create');
            servicecoreServStub.withArgs('walletactivitydetailsserv').returns(walletActivityDetailsServMock);
            var callback= sinon.spy();
            walletActivityDetailsServ.loadTransactionDetails(params,callback);
            assert(callback.calledOnce);
            assert(callback.threw);
            next();
        });
	});
});
