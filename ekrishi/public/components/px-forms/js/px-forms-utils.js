/**
* px-forms-utils
* A set of utilities for inputs fields. 
* LAP Aid: When the label is placed inside the input, shows/hides the label on focus/blur
* @class px-forms-utils
*/
define('px-forms-utils',['jquery'], function($) {


	var Utils = {
	
	    /**
		* Initiates the Util module. It collect DOM elements and attach focus and blur events to them
		*
		* @method init
		* @return void 
		*/
		init : function() {
			this._getElements();
			this._addListeners();
		},
		
		/**
		* It quotes the DOM and retrieves all the input elements within a .textInput class 
		*
		* @method _getElements
		* @return void 
		*/
		_getElements : function() {
			this.inputsEl = $('.textInput input');
		},
		
		/**
		* It attaches focus and blur events to the input elements 
		*
		* @method _addListeners
		* @return void 
		*/
		_addListeners : function() {
			var inputsEl = this.inputsEl;
			
			inputsEl.on('focus', $.proxy(this._onFocus, this));
			inputsEl.on('blur', $.proxy(this._onBlur, this));

		},
		
		/**
		* On Focus, we add the accessAid class to the input to clear the label
		*
		* @method _onFocus
		* @param {Event} The Event object
		* @return void 
		*/
		_onFocus : function (event) {
			var input = event.target,
				label = $(input).siblings('label');
			
			if (input.value === "") {
				label.addClass('accessAid');
			}
			
		},
		
		/**
		* On blur, we remove the accessAid class to the input to show the label
		*
		* @method _onBlur
		* @param {Event} The Event object
		* @return void 
		*/
		_onBlur : function (event) {
			var input = event.target,
				label = $(input).siblings('label');
				
			if (input.value === "") {
				label.removeClass('accessAid');
			}
			
		}
	}
	
	return Utils;	
});
