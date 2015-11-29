'use strict';

var core = require('../models/wrappers/disputeCoreIntegration'),
	_ = require('lodash');

// Moving dynamic url part to CAL msgbody
function customizeCal (req, res) {
	var model = req.model || {},
		routerPath;

	if (req.route && req.params) {
		// removing special character ':' from the url
		routerPath = req.route.path.replace(/:/g, '');		
		
		model.rootTxn = {
			name: 'resolutioncenter' + routerPath,
			data: req.params,
			status: 0
		};
	}
}

// Avoiding isRcrEnabled duplicate calls
function killswitch (req, res, next) {
	var error,
		txnId = req.body.txnId || req.params.txnId || req.session.txnId;

	req.session.isRcrEnabled = (req.session.isRcrEnabled) ? req.session.isRcrEnabled : {};

	if (req.session.isRcrEnabled[txnId] === false) {
		req.logWrap('error', "[RcrEnabledSessionCheckFailed] RCR is not enabled for this user or scenario", next);
	} else if (req.session.isRcrEnabled[txnId] === true) {
		next();
	} else {
		if (txnId) {
			core.getSenderTransactionDetails(txnId, function (err, txnDetails) {
				if (err) {
					req.logWrap('error', err, next);
				} else if (!(_.has(txnDetails, 'body.result.responseStatus.returnCode'))) {
					req.logWrap('error', "Error response from DisputeCoreIntegration:get_sender_transaction_details", next);
				} else if (req.isErrorCode(txnDetails.body.result.responseStatus.returnCode)) {
					req.logWrap('error', "Error response from DisputeCoreIntegration:get_sender_transaction_details -- " + txnDetails.body.result.responseStatus.returnMessage, next);
				} else {
					var input = {
						txnId: txnId,
						buyerAccountNumber: txnDetails.body.result.accountNumber,
						sellerAccountNumber: txnDetails.body.result.counterparty
					};
					core.isRcrEnabled(input, function (err, result) {
						if (err) {
							req.logWrap('error', err, next);
						} else if (!(_.has(result, 'body.result.responseStatus.returnCode'))) {
							req.logWrap('error', "Error response from DisputeCoreIntegration:is_rcr_enabled", next);
						} else if (req.isErrorCode(result.body.result.responseStatus.returnCode)) {
							req.logWrap('error', "Error response from DisputeCoreIntegration:is_rcr_enabled -- " + result.body.result.responseStatus.returnMessage, next);
						} else if (result.body.result.rcrEnabled === false) {
							req.session.isRcrEnabled[txnId] = false;
							req.logWrap('error', "[RcrEnabledServiceCheckFailed] RCR is not enabled for this user or scenario", next);
						} else {
							req.session.isRcrEnabled[txnId] = true;
							req.logWrap('info', "[RcrEnabledServiceCheckSuccess] Enabled for txn: " + txnId, next);
						}
					});
				}
			});
		} else {
			req.logWrap('error', "No transaction ID given. Cannot run RCR enabled check.", next);
		}
	}
}

module.exports = function (req, res, next) {
	//customizeCal(req, res, next);
	killswitch(req, res, next);
};
