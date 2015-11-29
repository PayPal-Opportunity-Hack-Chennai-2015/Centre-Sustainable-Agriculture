# px-forms

## Overview
The px-forms component is based on the [Bootstrap 3](http://getbootstrap.com/css/#forms) forms component. It provides a set of base styles for all the different form controls.

Additionally, it also provides a small set of JS utilities like LAP. LAP is an aid for forms in which the label is placed directly inside the input element, and needs to be shown/hidden on focus/blur.


Dependent components:
   * [px-base](https://github.paypal.com/UIE-Components/px-base)

## Prerequisite
   * Components are distributed through Bower. For more information on Bower & Bower installation please follow [Getting Started](https://github.paypal.com/pages/UIE-components/px-bootstrap/getting-started.html)

## Installation
### Usage under Kraken
##### Navigate to public/templates folder under Node-Webcore project in Command Prompt
```sh
bower install px-forms
```
##### Add CSS files in application's less file as
```css
@import "../components/px-forms/less/px-forms";
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
