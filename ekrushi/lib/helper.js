'use strict';
var bundalo = require('bundalo'),
	path = require('path'),
	bundaloConfig = {
		fallback: 'en_US',
		contentPath: path.join(process.cwd(), 'locales'),
		cache: true,
		engine: 'dust'
	};

module.exports = {

	/**
	 * Update the selected items for checkbox options
	 * @param selectedItems
	 * @param avalilabeItems
	 * returns availableItems with selected values
	 */

	handleCheckboxSelections: function (selectedItems, avalilabeItems) {
		var updatedItemDesc = {};
		avalilabeItems.forEach(function (key) {
			if (selectedItems.indexOf(key) !== -1) {
				updatedItemDesc[key] = "selected";
			} else {
				updatedItemDesc[key] = "unselected";
			}
		});
		return updatedItemDesc;
	},

	// about to handle
	fetchDynamicMessage: function (bundle, locale, data, callback) {
		var provider = bundalo(bundaloConfig);
		provider.get({'bundle': bundle,'locality': locale, 'model': data}, callback);
	},

	getbusinessName: function (obj) {
		var name;
		if (Array.isArray(obj.businesses) && obj.businesses[0] &&
				obj.businesses[0].name) {
			name = obj.businesses[0].name;
		} else if (obj.name.accountFullName) {
			name = obj.name.accountFullName;
		} else {
			name = "";
		}
		return name;
	}

};