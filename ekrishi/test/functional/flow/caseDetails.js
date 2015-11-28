var CaseDetails = function (nemo) {
  this.nemo = nemo;
};

var _enterCaseDetails = function (nemo) {
    nemo.view.caseDetails.viewOpenCases().click();
    nemo.view.caseDetails.successViewOpenCasesWait(10000, 'Could not view open  cases');
    nemo.view.caseDetails.viewCaseWaitVisible().click();
}

CaseDetails.prototype.loadCaseDetailsSuccess = function() {
    _enterCaseDetails(this.nemo);
  return this.nemo.view.caseDetails.successViewCaseWait(10000, 'Could not view case');
};

module.exports = CaseDetails;
