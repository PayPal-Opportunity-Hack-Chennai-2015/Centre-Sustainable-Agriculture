"use strict";
var assert = require('assert'),
	dwrap,
	wd,
	loc = {
		"login": require("../locator/login"),
	};
function Login(config) {
	this.driver = config.driver;
	drivex = config.drivex,
	wd = config.wd;
}

Login.prototype = {
	login: function (email, password) {
		var driver = this.driver;
		if (!driver) {
			assert(false, "FlowUtils: login, driver is not set!");
		}
		if (!email || !password) {
			assert(false, "FlowUtils: login, email or pwd is empty!");
		}
		driver.wait(function() {
			return drivex.present(loc.login.emailInput);
		}, 10000, "view:login, can't locate the email/password inputs on the page");
		drivex.find(loc.login.emailInput).clear();
		drivex.find(loc.login.emailInput).sendKeys(email);
		drivex.find(loc.login.passwordInput).sendKeys(password);
		drivex.find(loc.login.submitButton).click();
		return driver.wait(function() {
			return drivex.present(loc.login.logoutLink);
		}, 10000, "view:login: login timed out");
	}
};

module.exports = Login;