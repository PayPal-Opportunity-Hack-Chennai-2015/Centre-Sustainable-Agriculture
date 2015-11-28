define([
	'jquery',
	'underscore',
	'backbone',
	'bootstrap',
	'bootstrapAccessibility',
	'opinionLabComponent'
], function ($, _, Backbone) {
	'use strict';

	var View = Backbone.View.extend({

		el: "#resolutionCenter",

		events: {
			'click .nav li > label': 'setActiveTab',
			'change .panel textarea': 'syncTextAreas'
		},

		initialize: function () {
			var that = this;

			$(document).ready(function () {
				var viewJS = $("div.section").data("js"),
					$popovers = $("[data-toggle='popover']");

				// require view-specific javascript
				if (typeof viewJS === "string") {
					require([viewJS], function (View) {
						if (typeof View === 'function') {
							var view = new View(); // initialize the JS
						}
					});
				}

				// TODO: Review for later release
				// $(".fileUploadLink").uploadLink();

				// handle mock links that do nothing
				$("a.inactive").click(function (e) {
					e.preventDefault();
					return false;
				});

				// initialize popovers
				$popovers.popover({
					trigger: 'manual'
				});

				// custom popover behavior (only one at a time)
				$popovers.on('mouseenter', function (e) {
					e.stopPropagation();
					$popovers.not(this).popover('hide');
					$(e.target).popover('show');
				});

				// hide all popovers when clicking document
				$(document).click(function (e) {
					if (($('.popover').has(e.target).length == 0) || $(e.target).is('.close')) {
						$popovers.popover('hide');
					}
				});

				// handle suggested refund buttons behavior
				// By keeping it on appView, all other pages can use
				if ($('fieldset.partial-refund-options').length) {
					that.refundRequestAmount = $('#refundRequestAmount');
					
					//handles deselect of suggested refund amounts when custom amount input is focused
					that.refundRequestAmount.on('focus', function(e){
						$('.partial-refund-options .sr-only input').removeAttr('checked');
						$('#suggestCustom').prop("checked", true);
						$('#suggestedRefund').val('custom');
						$('.partial-refund-options label').removeClass('active');
						$(e.target).addClass('active');
						$(e.target).parent('.currency-inline').find('label').addClass('active');

						if (that.refundRequestAmount.parent().hasClass('has-error')) {
							that.refundRequestAmount.parent().removeClass('has-error');							
						}
					});
					
				}

			});
		},

		/**
		 * Handles state of hidden radio inputs associated with clicked tab labels
		 * @param  {[type]} e Event target
		 */
		setActiveTab: function (e) {
			var label = $(e.target),
				inputId = label.attr('for'),
				input = $("#" + inputId),
				$suggestedRefund;

			// set active label style
			// TODO: Check input 'type' instead of name?
			if (input.attr('name') === 'itemDescription') {
				if (input.is(':checked')) {
					label.removeClass('checked');
				} else {
					label.addClass('checked');
				}
			} else if (input.attr('name') === 'suggestedRefundOption') {
				$suggestedRefund = $('#suggestedRefund');

				// keeping suggest refund buttons in common
				if (label.hasClass('active')) {
					$('.partial-refund-options label').removeClass('active');
					document.getElementById(inputId).checked = false;
					input.prop('checked', false);
					this.refundRequestAmount.val('').removeClass('active');
					$suggestedRefund.val('');
				} else {
					$('.partial-refund-options label').removeClass('active');
					label.addClass('active');
					document.getElementById(inputId).checked = true;
					input.prop('checked', true);
					$suggestedRefund.val(input.val());
					if(input.attr('id') !== 'suggestCustom') {
						this.refundRequestAmount.val('').removeClass('active');
					} else {
						this.refundRequestAmount.addClass('active');
						//A hack - adding the timeout allows the .focus() to occur after the blur event completes
						setTimeout(function(){
							this.refundRequestAmount.focus();
						}, 1);
					}
				}
			}
			else {
				// reset all labels and apply 'active' style
				label.parents('.nav').find('label.active').removeClass('active');
				label.addClass('active');
			}

			// trigger click event to toggle 'checked' state
			//input.prop('checked', !input.is(':checked')).click();
		},

		/**
		 * Handles syncing of textarea values across different solution panels
		 * @param {Object} e Event target
		 */
		syncTextAreas: function (e) {
			$('.panel textarea').val(e.target.value); // set the value of hidden textareas to what they wrote
		}

	});

	return View;
});
