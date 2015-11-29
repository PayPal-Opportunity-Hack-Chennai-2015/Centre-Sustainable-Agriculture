var Navigate = function (nemo) {
  this.nemo = nemo;
};

var _enterLoginForm = function (nemo, user, pass) {
    nemo.driver.get(nemo.data.baseUrl);
    nemo.view.login.emailWaitVisible().sendKeys(user);
    nemo.view.login.password().sendKeys(pass);
    return nemo.view.login.button().click();
}
var _enterLoginFormRCR = function (nemo, user, pass) {
    nemo.driver.get(nemo.data.baseUrl);
    nemo.view.login.emailInputWaitVisible().clear();
    nemo.view.login.emailInput().sendKeys(user);
    nemo.view.login.passwordInput().sendKeys(pass);
    return nemo.view.login.loginSubmit().click();
}

Navigate.prototype.loginSuccess = function(user, pass) {
  _enterLoginForm(this.nemo, user, pass);
  return this.nemo.view.login.successWait(10000, 'Success message did not appear');
};

Navigate.prototype.loginSuccessRCR = function(user, pass) {
    _enterLoginFormRCR(this.nemo, user, pass);
    return this.nemo.view.login.successLoginWait(10000, 'Success message did not appear');
};

Navigate.prototype.loginFailure = function(user, pass) {
  _enterLoginForm(this.nemo, user, pass);
  return this.nemo.view.login.failureWait(10000, 'Failure message did not appear');
};

Navigate.prototype.legacyLogout = function() {
  var isLoggedOut = this.nemo.view.login.legacyLogoutLink().click();
  return isLoggedOut;
};

Navigate.prototype.merchantLogout = function() {
    var isLoggedOut = this.nemo.view.login.merchantLogoutLink().click();
    return isLoggedOut;
};

module.exports = Navigate;
