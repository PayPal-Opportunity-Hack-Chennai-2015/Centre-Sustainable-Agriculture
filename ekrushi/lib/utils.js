/** Utils : Can be use to for global functions. **/
'use strict';

function Utils(timezone) {
	this.timezone = timezone || "America/Los_Angeles";
}

Utils.prototype = {

	formatPhoneNumber: function (phoneNumber) {

		var formattedNumber,
			countryCode;

		/* Remove all leading zeros and non numeric information from phone number
						i.e () . , - + anything not a number */
		phoneNumber = phoneNumber.replace(/[^0-9]+/ig, '').replace(/^0+/, '');

		if (phoneNumber.length === 10) {

			/* Adding to logic to check phone number is US/CA or Singapore */
			countryCode = phoneNumber.substring(0, 3);

			if (this._verifyCityCode(countryCode)) {
				/* Format Singapore number  +65 12345678*/
				countryCode = phoneNumber.substring(0, 2);
				phoneNumber = phoneNumber.substring(2);
				formattedNumber = this._formattedPhoneNumber(countryCode, phoneNumber);
			} else {
				/* Format US number  (123) 456-7890 */
				formattedNumber = this._formattedPhoneNumber(countryCode, phoneNumber);
			}

			return formattedNumber;

		} else if (phoneNumber.length === 11) {

			/* Consider it as a US/Canada number and get First Digit as a country code */
			countryCode = phoneNumber.substring(0, 1);
			phoneNumber = phoneNumber.substring(1);
			formattedNumber = this._formattedPhoneNumber(countryCode, phoneNumber);
			return formattedNumber;

		} else if (phoneNumber.length === 12) {
			/* sendmoney is supported this countries US/CA, AU, BR, SP, FR, GB, IT, SG
					Get First 2 Digit as a country code and format number */
			countryCode = phoneNumber.substring(0, 2);
			phoneNumber = phoneNumber.substring(2);
			formattedNumber = this._formattedPhoneNumber(countryCode, phoneNumber);
			return formattedNumber;

		}

		/* TODO: We will pass phone number to service. Service will validate number and
		return success (funding option) or error */
		return phoneNumber;
	},

	_verifyCityCode: function (cityCode) {
		/* Sendmoney supported country code US/CA, AU, BR, SP, FR, GB, IT, SG */
		//var countryCityCode = [1, 66, 55, 34, 33, 44, 39, 65, 650, 651, 657];
		/* Verify Non US area code */
		var areaCode = [652, 653, 654, 655, 656, 658, 659]; //Non US city code
		return areaCode.indexOf(parseFloat(cityCode)) > -1;
	},

	_formattedPhoneNumber: function (countryCode, phoneNumber) {
		return '(' + countryCode + ') ' + phoneNumber.substring(3, 6) + '-' + phoneNumber.substring(6, 10);
	},

	getPercentage: function (num, percent) {
		var percentage = num * percent / 100;
		return percentage;
	}

};

module.exports = Utils;