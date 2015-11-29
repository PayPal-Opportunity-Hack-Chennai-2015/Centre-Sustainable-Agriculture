# <Component Name>

## Overview
SiteCatalyst is a web analytics application offered by Omniture. It collects data about certain usage metrics of a website such as hit counts, abandonment rates, and usage patterns, correlated with some PayPal-specific information about the users.

The SiteCatalyst component will add JavaScript to the page as well as include an external JavaScript file that is owned by the analytics team.  The external JavaScript file is referenced from the paypalobjects pool of servers.

If you are using one of the layout files, this component is already included.

| Attributes                    | Expected Values    | Description            																                                                                                           |
| -----------------             |:------------------	| :--------------------------------------------------------------------------	                                                  |
| disableOnLoad	                | --     		          | Disable attaching onload event so that pages with Ajax response will have more control|

## Prerequisite
   * CoreComponents are distributed through Bower. For more information on Bower & Bower installation please follow [Getting Started](/pages/CoreComponents/corecomponents.github.com/gettingStarted.html)

## Installation
### Usage under Node-Webcore
##### Navigate to public/templates folder under Node-Webcore project in Command Prompt
```sh
bower install UVLSiteCatalyst
```
##### Call SiteCatalyst from any partial as .
```dust
{>"components/UVLSiteCatalyst/templates/siteCatalyst" disableOnLoad=""/}
```
#### Populate Mock Data
Load [Mock Data](https://github.paypal.com/CoreComponents/UVLSiteCatalyst/blob/master/mock/data/default.json) to populate SiteCatalyst
### Porting to Sparta
| Copy              | From Webcore                                    		| To Sparta    																																	|
| ------------|:-------------------------------------------     		| :-------------------------------------------------------------|
| dust		    | Public/templates/components/UVLSiteCatalyst/templates 	| webapp/WEB-INF/tmpl/dust/components/UVLSiteCatalyst/templates/	|
#### Populate Data in Sparta
SiteCatalyst data will be populated automatically by Sparta Framework.
## Example Usage
```dust
{>"components/UVLSiteCatalyst/templates/siteCatalyst" disableOnLoad="" /}
```

## Known Issues
No known issues at this time

## Locale Support
n/a

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
