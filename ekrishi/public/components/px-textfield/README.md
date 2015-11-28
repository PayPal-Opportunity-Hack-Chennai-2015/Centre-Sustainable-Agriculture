# px-textfield

## Overview
The px-textfiled component adds an html input type equals text to the page.  It includes all the necessary markup and css.

| Attributes        | Expected Values   | Description  																																|
| ----------------- |:------------------| :-----------------------------------------------------------------------------------------------------------------------------------------|
| autocomplete      | -- 				| Input autocomplete 																										|
| autofocus      	| --  				| Input autofocus 																									|
| name				| --     			| Input name (defaults to id value)	 																										|
| type				| --      			| Input type (defaults to 'text' value)	 																									|
| value				| --      			| Input value																																|
| label				| --    			| Input label 																																|
| labelKey			| properties file content    | Input label key to use with content 																										|
| id				| --    			| Input ID																																	|
| className      	| Predefined width classes "large(67%), medium(50%), small(33%)" 				| CSS class names to apply to the input's parent element																					|
| lap				| "true"/"" 		| Applies paypal specific placeholder behaviour to input field. 																			|
| pattern      		| regex  			| Regex pattern																																|
| confidential		| --     			| Set to enable "confidential" behavior in Tea Leaf	 																						|
| required			| --      			| Set HTML5 required field validation 																										|
| restricted		| --      			| Set to enable "restricted"" behavior in Tea Leaf 																							|
| autocapitalize	| --    			| Input autocapitalize 																									|
| placeholder	| --    			| Placeholder for input																					|
| maxlength	| --    			| Max length for input																							|
| autocorrect		| --      			| Input autocorrect  																										|
| tall				| "true"/""   		| Boolean to indicate if 40px height is required. Default it 34px. 																			|
| errors      | "true"/""       | Boolean to indicate if the field has error

Dependent components:
   * [px-base](https://github.paypal.com/UIE-Components/px-base)
   * [px-forms](https://github.paypal.com/UIE-Components/px-forms)
   * [jQuery](https://github.paypal.com/CoreComponents/jQuery)

## Prerequisite
   * Components are distributed through Bower. For more information on Bower & Bower installation please follow [Getting Started](https://github.paypal.com/pages/UIE-components/px-bootstrap/getting-started.html)


## Installation
### Usage under Kraken 
##### Navigate to public/templates folder under Kraken project in Command Prompt
```
> bower install px-textfield
```
##### Call px-textfield from any partial as 
```html
{>"components/px-textfield/templates/px-textfield" className="medium" /}
```
##### Add CSS files in application's less file as
```css
@import "../components/px-base/less/px-base";
@import "../components/px-forms/less/px-forms";
@import "../components/px-textfield/less/px-textfield";

```
##### If your design requires your labels to be inside the inputs, add following utilitiy to show/hide the labels on focus/blur under paths in main.js
```javascript
	"px-forms-utils" : "../components/px-forms/js/px-forms-utils"
```
##### Add following JS snippet to load and initialize lap behaviour
```javascript
define(['px-forms-utils'], function(utils) {
  utils.init();
});
```

## Screenshot
![textInput Screenshot](https://github.paypal.com/pages/CoreComponents/corecomponents.github.com/images/components/textInput/textInput.png)

## Example Usage
```dust
<form>
  {>"components/px-textfield/templates/px-textfield" className="medium" /}
</form>
```
```dust
<form>
  {>"components/px-textfield/templates/px-textfield" className="large" lap="true" tall="true" /}
</form>
```

## Known Issues
No known issue

## Locale Support
US only

## Versioning
All Components utilize the Semantic Versioning guidelines.

Releases will be numbered with the following format:

&lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;

And constructed with the following guidelines:

Breaking backward compatibility bumps the major (and resets the minor and patch)
New additions without breaking backward compatibility bumps the minor (and resets the patch)
Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit http://semver.org/.

## Contributions
We welcome contributions. If you have an enhancement that could benefit other teams or have discovered and resolved a bug, we encourage you to submit a Git Pull request to make your changes available to all users of the component.

Please review our contribution guidelines prior to submitting your request.
