# OpinionLab

## Overview
OpinionLabs is a 3rd-party site which collects survey-style user feedback. Feedback is entered into a popup window accessed through certain pages on www.paypal.com. The popup window is served by opinionlabs.com so is not hosted by paypal.com (paypal.com pages only create the link to the survey popup window).

Additional information can be found at https://dev.paypal.com/wiki/General/UVLOpinionLab.

This component is included in FooterMarketing, FooterProduct, and FooterMinimal

| Attributes                    | Expected Values   | Description      																		|
| -----------------             |:------------------| :-------------------------------------------------------------------------------------|
| showSiteFeedbackIcon          | -- 				| Boolean indicating whether to show or hide [+] icon image next to site feedback link	|
| miniBrowser      	            | --  				| Boolean indicating if opinionLab is used inside a miniBrowser						|
| commentCardCmd				| --     			| PayPal command link used to first direct the comment card link to a PayPal page which then redirects to the OpinionLab site	 																				|
| sfRedirect				    | "true"      			| Boolean to open OpinionLab popup after redirection through Paypal server. When disabled, popup opens directly on 'secure.opinionlab.com'																					|
| showOpinionLabOnBrowserClose	| --      			| Boolean indicating whether to open opinion lab pop up on closing PP window																																|
| siteFeedbackLabelKey			| --    			| Content key to find correct site feed back label																																|

## Prerequisite
CoreComponents are distributed through Bower. For more information on Bower & Bower installation please follow [Getting Started](/pages/CoreComponents/corecomponents.github.com/gettingStarted.html)

## Installation
### Usage under Node-Webcore 
##### Navigate to Public/templates folder under Node-Webcore project in Command Prompt
```
> bower install UVLOpinionLab
```
##### Wrap OpinionLab partial with an HTML element with id 'siteFeedback' as below.
```html
<div id='siteFeedback'>
	{>"components/UVLOpinionLab/templates/opinionLab" 
    		commentCardCmd=""
		showOpinionLabOnBrowserClose="false" 
		sfRedirect="false"
			
		showSiteFeedbackIcon="false" 
		miniBrowser="false"
		siteFeedbackLabelKey="CoreComponents.Footer.siteFeedbackLabel" /}
</div>
```
##### Add following under paths in main.js
```javascript
"opinionLab"            : "../templates/components/UVLOpinionLab/js/opinionLab",
"opinionLabComponent"   : "../templates/components/UVLOpinionLab/js/opinionLabComponent",
"onlineOpinionPopup"    : "../templates/components/UVLOpinionLab/js/onlineOpinionPopup"
```
##### Add following JS snippet to load and initialize OpinionLab
```javascript
define(['opinionLabComponent']);
```
#### Adding to buildconfig.js for JS Optimization with r.js
```javascript
"opinionLab"            : "../templates/components/UVLOpinionLab/js/opinionLab",
"opinionLabComponent"   : "../templates/components/UVLOpinionLab/js/opinionLabComponent",
"onlineOpinionPopup"    : "../templates/components/UVLOpinionLab/js/onlineOpinionPopup",
"opinionLabVars"	: "empty:"
```
##### Populate Mock Data
Load [Mock Data](https://github.paypal.com/CoreComponents/UVLOpinionLab/blob/master/mock/data/default.json) to populate OpinionLab.

### Porting to Sparta
| Copy              | From Webcore                                      | To Sparta        																																|
| ----------------- |:-------------------------------------------       | :---------------------------------------------------------|
| js                | Public/templates/components/UVLOpinionLab/js         | webapp/js/components/UVLOpinionLab/							|
| dust				| Public/templates/components/UVLOpinionLab/templates  | webapp/WEB-INF/tmpl/dust/components/UVLOpinionLab/templates/	|

##### Populate Data in Sparta
  * Everything under [sys](https://github.paypal.com/CoreComponents/UVLOpinionLab/blob/master/mock/data/default.json#L7) is populated automatically.
  * To populate [encryptedAccountNumber](https://github.paypal.com/CoreComponents/UVLOpinionLab/blob/master/mock/data/default.json#L4) add the following in Controller to populate TemplateModel with Logged-in user information.
  
```css
	public String render(ModelMap model) throws Exception {
		...
		model.put("user", DustCoreUtils.getBasicUserData());
		...
```
## Screenshot
Feedback link along with OpinionLab Popup
![textInput Screenshot](https://github.paypal.com/pages/CoreComponents/corecomponents.github.com/images/components/OpinionLab/OpinionLab.png)

## Example Usage
```dust
<li id="siteFeedback">
	{>"components/UVLOpinionLab/templates/opinionLab" 
    					commentCardCmd="""
					showOpinionLabOnBrowserClose="false" 
					sfRedirect="false"
					
					showSiteFeedbackIcon="false" 
					miniBrowser="false"
					siteFeedbackLabelKey="CoreComponents.Footer.siteFeedbackLabel" /}
</li>
```

## Known Issues
No known issue

## Locale Support
All Locales

## Versioning
All Core Components utilize the Semantic Versioning guidelines.

Releases will be numbered with the following format:

&lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;

And constructed with the following guidelines:

Breaking backward compatibility bumps the major (and resets the minor and patch)
New additions without breaking backward compatibility bumps the minor (and resets the patch)
Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit http://semver.org/.

## Contributions

We welcome contributions. If you have an enhancement that could benefit other teams or have discovered and resolved a bug, we encourage you to submit a Git Pull request to make your changes available to all users of the component.

Please review our contribution guidelines prior to submitting your request - https://github.paypal.com/Sparta/SpartaCoreComponentsJSP/wiki/Pull-Request-Acceptance-Criteria
