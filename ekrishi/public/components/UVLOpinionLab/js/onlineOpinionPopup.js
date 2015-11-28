/*
 Spec #22956 OpinionLab
 */

define(['opinionLab'], function(opinionLab) {

	'use strict';
	window.PAYPAL = window.PAYPAL ? window.PAYPAL : {};
	var opVars = window.PAYPAL.opinionLabVars;

	function showpopup(redirectTo) {
		var mywin;
		mywin = window.open('', '', 'top=3000,left=3000,width=1,height=1,menubar=0,scrollbars=0,resizeable=1');
		if (mywin) {
			mywin.document.open
			var myURL = ""

			/* This JS is customized for sparta because a JS call

			 /* Comparing with corresponding XPT code - Removed the External opinionlab js from the popup content as it could not be loaded due to path issue */

			HTML_txt = "<html><scr" + "ipt language='javascript'>";
			HTML_txt = HTML_txt + "_hr='" + opinionLab._hr + "';";
			HTML_txt = HTML_txt + "_ht='" + opinionLab._ht + "';";
			HTML_txt = HTML_txt + "custom_var='" + opinionLab.custom_var + "';";

			if (( typeof opinionLab.baseurl == 'undefined')) {
			} else {
				HTML_txt = HTML_txt + "baseurl='" + opinionLab.baseurl + "';";
			}
			if (( typeof opinionLab.url_var == 'undefined')) {
			} else {
				HTML_txt = HTML_txt + "url_var='" + opinionLab.url_var + "';";
			}

			if (redirectTo == 'ppwebscr') {
				myURL = opinionLab.PP_O_LC(false);
			} else {
				myURL = opinionLab.O_LC(false);
			}

			/* Comparing with corresponding XPT code - Added the below line newly in sparta. For FF, writing some JS variables that are required in the intermediate popup*/

			if (document.all) {
			} else {
				HTML_txt = HTML_txt + "var _cw =window;var _copinionlabURL ='" + myURL + "';var _cW =" + screen.width + ";var _cH =" + screen.height + ";";
			}

			/* Comparing with corresponding XPT code - modified for firefox - replacing the function call O_LC or PP_O_LC with window.open statement*/

			HTML_txt = HTML_txt + 
				"function connect () {"
				+	"try{"
				+		"if( document.all ) {"
				+			"if( window.opener.closed ){"
				+				"window.location.replace('" + myURL + "');"
				+			"} else {" 
				+				"self.close();"
				+			"}"
				+		"} else {"
				+			"if( opener == null ){"
				+				"_cw.open(_copinionlabURL, 'comments', 'width=535,height=192,screenX=' +((_cW-535)/2)+ ',screenY='+ ((_cH-192)/2) +',top='+ ((_cH-192)/2) +',left='+ ((_cW-535)/2) +',resizable=yes,copyhistory=yes,scrollbars=no');"
				+				"setTimeout('self.close()', 5000);"
				+			"}else{"
				+				"self.close();"
				+			"}"
				+		"}"
				+	"}catch( err ) {"
				+		"window.location.replace('" + myURL + "');"
				+	"}"
				+	"return 0;"
				+"}</scr";
			HTML_txt = HTML_txt + "ipt><body><scr" + "ipt language='javascript'>setTimeout('connect()',1);</scr" + "ipt></body></html>";

			mywin.document.write(HTML_txt);
			mywin.document.close
		}
	}

	return {
		'OpinionLabOnCloseEvent' : function OpinionLabOnCloseEvent(redirectTo) {
			window.onunload = function() {
				opinionLab.assignSiteCatalystVars();
				if (navigator.appName == "Microsoft Internet Explorer") {
					var evt = window.event;
					if (navigator.userAgent.indexOf('MSIE 6.0') !== -1) {
						if (evt.clientX < 0 && evt.clientY < 0) {
							showpopup(redirectTo);
						}
					} else {
						if (evt.clientX < 0 || evt.clientY < 0) {
							showpopup(redirectTo);
						}
					}
				} else if (navigator.userAgent.indexOf('Firefox/3') !== -1) {

					var width = parseFloat(window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.getElementsByTagName('body')[0].clientWidth));
					var height = parseFloat(window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.getElementsByTagName('body')[0].clientHeight));

					if (width <= 0 || height <= 0) {
						showpopup(redirectTo);
					}
				} else {
					showpopup(redirectTo);
				}
			}
		}
	};
});
