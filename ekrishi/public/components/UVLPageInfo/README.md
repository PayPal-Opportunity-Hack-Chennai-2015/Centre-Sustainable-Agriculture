# PageInfo
Documentation In Progress

## Overview
The PageInfo component adds information like template name, date, country, language, webversion, content version, hostname to the page.
Also as of now, additional debug related information for NodeJs stack.

## Prerequisite
CoreComponents are distributed through Bower. For more information on Bower & Bower installation please follow [Getting Started](/pages/CoreComponents/corecomponents.github.com/gettingStarted.html)

## Installation
### Usage under Node-Webcore
##### Navigate to public/templates folder under Node-Webcore project in Command Prompt
```
> bower install UVLPageInfo
```
##### Call PageInfo from any partial as
```html
{>"components/UVLPageInfo/templates/pageInfo" /}
```
##### Populate Mock Data
Load [Mock Data](https://github.paypal.com/CoreComponents/UVLPageInfo/blob/master/mock/data/default.json)

### Porting to Sparta
| Copy              | From Webcore                                    | To Sparta        																															|
| ----------------- |:-------------------------------------------     | :-----------------------------------------------------------------------------|
| dust				      | Public/templates/components/UVLPageInfo/templates  | webapp/WEB-INF/tmpl/dust/components/UVLPageInfo/templates/										    |

##### Populate Data in Sparta
Sparta should populate [data](https://github.paypal.com/CoreComponents/UVLPageInfo/blob/master/mock/data/default.json) automatically.

## Screenshot
n/a

## Example Usage
```dust
{>"components/UVLPageInfo/templates/pageInfo"/}
```
## Known Issues
None at this time

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

Please review our contribution guidelines prior to submitting your request.


