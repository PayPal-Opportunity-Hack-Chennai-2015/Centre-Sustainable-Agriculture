define(['opinionLab', 'onlineOpinionPopup'], function(opinionLab, popup) {
	
	'use strict';
	window.PAYPAL = window.PAYPAL ? window.PAYPAL : {};
	var opVars = window.PAYPAL.opinionLabVars;
	
	/* Defines the referral URL - Verify */
	function paypalURL (pagename) {
		var paypalURL = 'https://'
						+ opVars.countryCode
						+ '.paypal.com/' 
						+ opVars.languageCode
						+ '/00/' 
						+ escape(pagename.replace(/\s|\//g, '_')) 
						+ '.page';
		return paypalURL;
	};
	
	function assignSiteCatalystVars() {
		if ( typeof opVars.isSiteRedirect !== 'undefined' && typeof opVars.isPaymentFlow !== 'undefined') {
			if ( typeof s !== 'undefined') {
				if ( typeof s.pageName !== 'undefined') {
					opVars.siteCatalystPageName = s.pageName;
				}
				if ( typeof s.prop7 !== 'undefined') {
					opVars.siteCatalystC7 = s.prop7 == "none" ? "Unknown" : s.prop7;
				}
				if ( typeof s.prop5 !== 'undefined') {
					opVars.siteCatalystAccountNumber = s.prop5;
				}
			}
			opinionLab.custom_var = updateCustomVars();
		}
	}
	
	function updateCustomVars () {
		var customVar = opVars.rLogId 
						+ '|' + opVars.siteCatalystC7 
						+ '|' + opVars.siteCatalystPageName 
						+ '|' + opVars.countryCode 
						+ '|' + opVars.languageCode 
						+ '|' + ( opVars.accountNumber && opVars.accountNumber.length > 0 ? opVars.accountNumber : 'Unknown')
						+ '|' + ( opVars.siteCatalystAccountNumber && opVars.siteCatalystAccountNumber.length > 0  ? opVars.siteCatalystAccountNumber : 'Unknown' )
						+ ( opVars.isSiteRedirect ? '' : '|Unknown|Unknown' );
		return customVar;
	}
	
	function initialize () {
		var self = this;
		opinionLab.assignSiteCatalystVars = function() {
			assignSiteCatalystVars.call(self);
		}
		
		opinionLab._ht 			= paypalURL("'" + opVars.siteCatalystPageName + "'");
		opinionLab.custom_var 	= updateCustomVars();
		
		/* Opinion Lab URL under redirection through Paypal */
		if (opVars.isSiteRedirect) {
				opinionLab.baseurl = "https://" 
								+ opVars.serverName 
								+ '/cgi-bin/webscr?cmd=_handle-sf-redirect'
								+ '&amp;account_number=' 
								+ opVars.accountNumber;
		}
		
		if (opVars.isPaymentFlow) {
			opinionLab.url_var = "https://" 
							+ opVars.serverName 
							+ '/cgi-bin/webscr?cmd=' 
							+ opVars.commentCardCmd 
							+ '&amp;account_number=' 
							+ opVars.accountNumber;
							
			opinionLab.baseurl += "&amp;url_var=https://" 
							+ opVars.serverName 
							+ "/cgi-bin/webscr?cmd=cmd$" 
							+ opVars.commentCardCmd 
							+ "|account_number$" 
							+ opVars.accountNumber;
		}
	};
	
	if ( typeof opVars.isSiteRedirect !== 'undefined' && typeof opVars.isPaymentFlow !== 'undefined') {
		if (opVars.miniBrowser) {
			opinionLab.Mini_O_GoT(opVars.feedback_link, opVars.isSiteRedirect);
		} else {
			if (opVars.isSiteRedirect) {
				opinionLab.PP_O_GoT(opVars.feedback_link);
			} else {
				opinionLab.O_GoT(opVars.feedback_link);
			}
		}
		
		initialize();
	
		if (opVars.isPaymentFlow) {
			var ppbce;
			if (opVars.isSiteRedirect) {
				ppbce = new popup.OpinionLabOnCloseEvent('ppwebscr');
			} else {
				ppbce = new popup.OpinionLabOnCloseEvent();
			}
		}
	
	}
});
