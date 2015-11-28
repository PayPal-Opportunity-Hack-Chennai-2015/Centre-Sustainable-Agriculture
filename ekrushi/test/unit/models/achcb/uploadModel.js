'use strict';
var assert = require('chai').assert,
	proxyquire = require('proxyquire').noCallThru(),
    fs= require('fs'),
    sinon = require('sinon'),
    should = require('should'),
    UploadModel = proxyquire('../../../../models/achcb/uploadModel', {
        "../documentUpload/docUploadModel": function(){
            this.upload = function(documentMetaData, dmsConfig, callback) {
                var docUploadResponse = {
                    'path':'xx',
                    'documentID':'yyy',
                    'uploadStatus':'true'
                };
                callback(null,docUploadResponse);
            };
        }
    }),
	dConsts = require("../../../../models/consts/dispute");

describe('uploadModel', function () {
	var req = {
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
            timezone: 'America/Los_Angeles',
            country: 'US',
            locale: 'en_US',
            culture: 'en-US',
            language: 'en',
            directionality: 'ltr',
            getCountrySpecifics: [Function],
            formatter: [Function],
            determiners:
            { country: 'viaUserProfile',
                locale: 'viaUserProfile',
                timezone: 'viaUserProfile' }
        },
        files:  {
            "test1": {
                "size": 170509,
                "path": "C:\\Users\\diramesh\\AppData\\Local\\Temp\\upload_6101e98087317e8578ca121e5a9b3c5d",
                "name": "Vittal.png",
                "type": "image/png",
                "mtime": "2015-03-31T09:47:32.516Z"
            },
            "test2": {
                "size": 170509,
                "path": "C:\\Users\\diramesh\\AppData\\Local\\Temp\\upload_124ae07121b4170270664ad14a9b09d5",
                "name": "Vittal.png",
                "type": "image/png",
                "mtime": "2015-03-31T09:47:32.516Z"
            }
        },
        body: {
            uploadDocType: "POS"
        }
	},
    dmsConfig = {
        "protocol": "http:",
        "hostname": "stage2cpp099.qa.paypal.com",
        "port": 6502,
        "transport": "generic",
        "method": "GET",
        "package": "docmanagerserv"
    };

    var uploadModel= null;

    before(function (next) {
        next();
    });


	it('should create a uploadModel', function (next){
        uploadModel = new UploadModel(req, dmsConfig);
        uploadModel.fileList.should.have.a.lengthOf(2);
        next();
	});

    describe('#send', function () {
        it('should upload files to DMS', function (next){
            var fsRenameStub = sinon.stub(fs,'rename');
            fsRenameStub.yields(null,{});
            function callback(err,response){
                response.should.not.empty;
                response.should.have.property('status').equal('success');
                response.should.have.property('documentsList').lengthOf(2);
                next();
            };
            var callback = sinon.spy(callback);
            uploadModel.send(callback);
            assert(callback.calledOnce);
        });
    });

});
