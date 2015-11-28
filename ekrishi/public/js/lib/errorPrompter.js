/**
 * This module provides functionality to prompt Error Message below the provided Document Element.
 * @author: Venkateswarlu Tumati
 */
define([
	'jquery'
],function($){

var ErrorPrompter = function() {

 this.calculatePosition = function(caller,divFormError){
			var callerTopPosition = $(caller).offset().top,
			callerleftPosition = $(caller).offset().left,
			callerWidth =  $(caller).width(),
			inputHeight = $(divFormError).height(),
			marginTopSize = 0,
			callerHeight =  $(caller).height();
			callerTopPosition = callerTopPosition + callerHeight + 15;
		return {

			"callerTopPosition":callerTopPosition,

			"callerleftPosition":callerleftPosition,

			"marginTopSize":marginTopSize

		}

              };

		this.linkTofield = function(caller){
      	var linkTofield = $(caller).attr("id") + "formError";
		linkTofield = linkTofield.replace(/\[/g,""); 
		linkTofield = linkTofield.replace(/\]/g,"");
		return linkTofield;    
			};
			
		this.promptError = function(caller,promptText){
		var deleteItself = "." + $(caller).attr("id") + "formError",
		divFormError = document.createElement('div'),
		formErrorContent = document.createElement('div'),
		linkTofield = this.linkTofield(caller);
		$(divFormError).addClass("formErrorContext")
		$(divFormError).addClass(linkTofield);
		$(formErrorContent).addClass("formErrorContentContext");
		$("body").append(divFormError);
		$(divFormError).append(formErrorContent);			
		$(formErrorContent).html(promptText);
		var calculatedPosition = this.calculatePosition(caller,divFormError)
		calculatedPosition.callerTopPosition +="px";
		calculatedPosition.callerleftPosition +="px";
		calculatedPosition.marginTopSize +="px"
		$(divFormError).css({
			"top":calculatedPosition.callerTopPosition,
			"left":calculatedPosition.callerleftPosition,
			"marginTop":calculatedPosition.marginTopSize,
			"opacity":0
		})
		return $(divFormError).animate({"opacity":0.87},function(){return true;}); 
                         };
};
var _instance = new ErrorPrompter();
return _instance;

});