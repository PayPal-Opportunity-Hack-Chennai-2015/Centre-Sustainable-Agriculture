/*
 * MODIFIED:
 * 	 - PP_Beta() added to distinguish from standard PP pages (8-ball)
 * 	 - Set survey url for Resolution Center Beta
 * 	 - Adjusted popup window dimensions to fit survey
 *
 * This file contains the javascript functions and snippets
 * that are used to introduce the site feedback link in the footer.
 * Function O_GoT inserts the link in the footer list and assigns onclick
 * for popup window that displays the feedback from from opinionlab site.
 */

define(['jquery'], function ($) {

	'use strict';
	window.PAYPAL = window.PAYPAL ? window.PAYPAL : {};
	var opVars = window.PAYPAL.opinionLabVars;

	var _doc = document,
		_w 	 = window,
		_tm  = (new Date()).getTime(),
		_sH  = screen.height,
		_sW  = screen.width;

	/**
	 * This method forms the siteFeedback image tag to be written into the DOM
	 * Note: While calling this method, please make sure to check if sitefbIcon is enabled. This is decided by boolean the property 'showSitefbIcon'.
	 * @returns sfimg
	 */
	function siteFeedBackImage () {
		var sfImg = document.createElement('img');
		sfImg.setAttribute('src', opVars.sitefb_plus_icon);
		sfImg.setAttribute('alt', '');
		return sfImg;
	}

	function popUp (opinionlabURL) {
		_w.open(opinionlabURL, 'comments', 'width=550,height=700'
											+ ',screenX=' + ((_sW - 550)/2)
											+ ',screenY=' + ((_sH - 700) / 2)
											+ ',top=' + ((_sH - 700) / 2)
											+ ',left=' + ((_sW - 550) / 2)
											+ ',resizable=yes'
											+ ',copyhistory=yes'
											+ ',scrollbars=no');
	}

	function createLink (_p) {
		var sfLink 	= document.createElement('a');

		sfLink.setAttribute('href', '#');
		sfLink.innerHTML=_p;
		sfLink.className = (opVars.className || 'feedback');
		_doc.getElementById('siteFeedback').appendChild(sfLink);

		if(opVars.showSitefbIcon){
			_doc.getElementById('siteFeedback').appendChild(siteFeedBackImage());
		}

		return sfLink;
	}

	function _fC (_u) {
		var _sp = '%3A\\/\\/',
			_rp = '%3A//',
			_aT = _sp + ',\\/,\\.,-,_,' + _rp + ',%2F,%2E,%2D,%5F',
			_aA = _aT.split(',');

		for (var i = 0; i < 5; i++) {
			eval('_u=_u.replace(/' + _aA[i] + '/g,_aA[i+5])');
		}
		return _u;
	}

	return {
			'custom_var'				: '',
			'_ht'						: escape(_w.location.href),
			'_hr'						: _doc.referrer,
			'_kp'						: 0,
			'baseurl'					: '',
			'url_var'					: '',
			'assignSiteCatalystVars'	: '',

			'PP_O_LC' : function (openPopup) {
				var opinionlabURL = this.baseurl + '&olparams='
									+ 'time1$' 			+ _tm
									+ '|time2$'			+ (new Date()).getTime()
									+ '|prev$'			+ _fC(escape(this._hr))
									+ '|referer$'		+ _fC(this._ht)
									+ '|height$'		+ _sH
									+ '|width$'			+ _sW
									+ '&custom_var='	+ this.custom_var;

			  	if(openPopup){
			  		popUp(opinionlabURL);
			  	}else{
			  		return opinionlabURL;
				}
			},

			'O_LC' : function (openPopup) {
				var opinionlabURL = 'https://secure.opinionlab.com/ccc01/comment_card.asp?'
									+ 'time1=' 			+ _tm
									+ '&time2=' 		+ (new Date()).getTime()
									+ '&prev=' 			+ _fC(escape(this._hr))
									+ '&referer=' 		+ _fC(this._ht)
									+ '&height=' 		+ _sH
									+ '&width=' 		+ _sW
									+ '&custom_var=' 	+ this.custom_var
									+ (this.url_var !== undefined && this.url_var.length > 0 ? '&url_var=' + _fC(escape(this.url_var)) : '');

				if (openPopup) {
					popUp(opinionlabURL);
				} else {
					return opinionlabURL;
				}
			},

			'O_GoT' : function (_p) {
				var sfLink 	= createLink(_p),
					self 	= this;

				sfLink.onclick=function(){
					self.assignSiteCatalystVars();
					self.O_LC(true);
					return false;
				};
				this.PP_Beta();
			},

			'PP_O_GoT' : function (_p){
				var sfLink 	= createLink(_p),
					self 	= this;

				sfLink.onclick=function(){
					self.assignSiteCatalystVars();
					self.PP_O_LC(true);
					return false;
				};
				this.PP_Beta();
			},

			'PP_Beta' : function() {
				// Override the original handler
				var node = document.getElementById('siteFeedback'),
					list = node ? node.getElementsByTagName('a') : [],
					indx = list.length,
					feedbackLink = $('a.feedback.beta'),
					self = this;

				while (feedbackLink.length > 0 && indx--) {
					list.item(indx).onclick = null;
				}
				// Style the link and attach the new event handler
				feedbackLink.removeClass('hidden');

				// Click event handler - opens survey in a popup window
				feedbackLink.on('click', function (event) {
					var optOut = ((/opt\-out/).test(event.target.className) || opVars.optOut),
						url,
						surveyLink = event.target.href,
						surveyLinkParts = surveyLink.split('s?s='),
						surveyCode;

					// Fetch the surveyCode dynamically
					surveyCode = (surveyLinkParts[1] && surveyLinkParts[1].length === 5) ? surveyLinkParts[1] : '';

					self.assignSiteCatalystVars();
					url = 'https://survey.opinionlab.com/survey/s?s=' + surveyCode +
					          '&custom_var=' + self.custom_var +
					          '&height=' + _sH +
					          '&referer=' + encodeURIComponent('http://' + (optOut ? 'opt-out.' : '') + 'beta.paypal.com/' + opVars.languageCode + '_' + opVars.countryCode + location.pathname) +
					          '&prev=' + encodeURIComponent(document.referrer) +
					          '&time1=' + _tm +
					          '&time2=' + (new Date()).getTime() +
					          '&width=' + _sW;
					if (!optOut) {
						event.preventDefault();
					}
					popUp(url);
				});

				// attach click event to popover content
				$('[data-toggle=popover]').on('shown.bs.popover', function () {
					self.PP_Beta();
				});
			},


			'Mini_O_GoT' : function (_p, base) {
				var sfLink 		= document.createElement('a'),
					sfLinkSpan 	= document.createElement('span'),
					self 		= this;

				sfLink.setAttribute('href','#');
				if(opVars.showSitefbIcon){
					sfLink.appendChild(siteFeedBackImage());
				}

				if ( base ) {
					sfLink.onclick = function () {
						self.assignSiteCatalystVars();
						self.PP_O_LC(true);
						return false;
					};
				} else {
					sfLink.onclick = function () {
						self.assignSiteCatalystVars();
						self.O_LC(true);
						return false;
					};
				}

				sfLinkSpan.innerHTML = _p;
				sfLink.appendChild(sfLinkSpan);
				_doc.getElementById('siteFeedback').appendChild(sfLink);
			}
	};
});