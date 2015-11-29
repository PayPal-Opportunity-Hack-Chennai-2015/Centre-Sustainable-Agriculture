# PageTracking

## Overview
The PageTracking partial (also known as First Party Tracking Identifier - FPTI) is a replacement for SiteCatalyst.  It embeds JavaScript onto the page as well as includes an external JavaScript file owned by the Analytics team.  The JavaScript gathers tracking data much the same way SiteCatalyst does and fires a beacon via an image src attribute sending data to a tracking server.

This component is included on pages alongside SiteCatalyst until SiteCatalyst is eventually phased out.

If your pages are built using one of the template partials, this component is already included.  If you're not using any Core templates, it's best to place this component as  low on the page as possible as to not interrupt page rendering for the user.

Additional information can be found on the FPTI's twiki page - https://dev.paypal.com/wiki/Sparta/FirstPartyTrackingIdentifier

| Attributes          | Expected Values     | Description    																																																					|
| -----------------   |:-----------------   | :------------------------------------------------|
| isMobileOptimized   | "true" / "" 			    | To enable loading mobile version FPTI javascript.

## Prerequisite
CoreComponents are distributed through Bower. For more information on Bower & Bower installation please follow [Getting Started](/pages/CoreComponents/corecomponents.github.com/gettingStarted.html)

## Installation
### Usage under Node-Webcore 
##### Navigate to public/templates folder under Node-Webcore project in Command Prompt
```
> bower install UVLPageTracking
```
##### Call PageTracking from any partial as 
```html
{>"components/UVLPageTracking/templates/pageTracking" isMobileOptimized="" /}
```

##### Populate Mock Data
Load mock data to populate PageTracking using either Default OR Mobile Optimized data below. 
  * [Default](https://github.paypal.com/CoreComponents/UVLPageTracking/blob/master/mock/data/default.json)
  * [Mobile Optimized Case](https://github.paypal.com/CoreComponents/UVLPageTracking/blob/master/mock/data/pageTrackingMobileOptimized.json)

### Porting to Sparta
| Copy              | From Webcore                                      | To Sparta      																																|
| ----------------- |:-------------------------------------------       | :-----------------------------------------------------------------------------|
| dust				      | Public/templates/components/UVLPageTracking/templates| webapp/WEB-INF/tmpl/dust/components/UVLPageTracking/templates/										|

##### Populate Data in Sparta
  * Sparta will populate everything under "[sys](https://github.paypal.com/CoreComponents/UVLPageTracking/blob/master/mock/data/pageTrackingMobileOptimized.json#L5)" automatically.
  * Mobile Optimized Case: [data.isMobile](https://github.paypal.com/CoreComponents/UVLPageTracking/blob/master/mock/data/pageTrackingMobileOptimized.json#L3) should be populated in Controller. See [Known Issues](#known-issues) for more detail. 

## Example Usage
```dust
{>"components/UVLPageTracking/templates/UVLPageTracking" isMobileOptimized="true" /}
```

## Known Issues
  * The component checks data.isMobile to determine whether it is a mobile device. In a future release,framework will populate isMobile inside sys json model.

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
We welcome contributions. If you have an enhancement that could benefit other teams or have discovered and resolved a bug, we encourage you to submit a Git Pull request to make your changes available to all component users.

Please review our contribution guidelines prior to submitting your request - https://github.paypal.com/Sparta/SpartaCoreComponentsJSP/wiki/Pull-Request-Acceptance-Criteria
