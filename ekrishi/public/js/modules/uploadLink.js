/**
 *
 * This JavaScript is used to decorate an input[type=file] as a link
 *
 * Author: Tim Sullivan tsullivan@paypal.com
 */

define(['jquery', 'jqueryUI'], function ($) {
	'use strict';

	$.widget('ResCenter.uploadLink', {
		options: {
			inputElem: '.fileUploadInput',
			listElem: '.fileNamesList',
			spinnerElem: '.fileUploadSpinner'
		},

		handleClick: function (event) {
			event.preventDefault();
			$(event.data.options.inputElem).get(0).click();
		},

		handleChange: function (event) {
			var i = 0,
				anchor = null,
				fileLen = event.target.files.length,
				listElem = event.data.options.listElem,
				spinnerElem = event.data.options.spinnerElem,
				newList = [];

			while (i < fileLen) {
				anchor = '<a href="#">' + event.target.files.item(i).name + '</a>';
				newList.push(anchor); // add file name to list
				i = i + 1;
			}

			// show throbber
			spinnerElem.show(); // show the upload files throbber to simulate ajax
			event.data.element.parents('p').hide(); // hide upload link
			listElem.parents('div.attachedFiles').hide(); // hide list

			// show file links
			window.setTimeout(function () {
				spinnerElem.hide();

				listElem.html(newList.join(", ")); // display the file links in span.fileNamesList
				listElem.parents('div.attachedFiles').show(); // unhide list
				event.data.element.parents('p').show(); // unhide upload link
			}, 2300);

			// clean up
			event.data.element.trigger('blur'); // unfocus the link
		},

		_create: function () {
			// override default option data
			this.options.inputElem = this.element.parent().siblings('input.fileUploadInput');
			this.options.listElem = this.element.parents("div.fileUpload").find("span.fileNamesList");
			this.options.spinnerElem = this.element.parents("div.fileUpload").find("div.fileUploadSpinner");

			// set events
			this.element.on('click', this, this.handleClick);
			this.options.inputElem.on('change', this, this.handleChange);
		}
	});
});
