#footer-merchant

## Overview
The merchant-footer component renders the footer for logged-in business accounts who are opted-in for new experience (Hawk).

| Attributes					| Expected Values		| Description|
| -----------------				|:------------------	| :------------------------------------------------------------
| showMainNav					| --					| Boolean indicating whether to show or hide utility nav.|
| showFeedback					| --					| Boolean indicating whether to show or hide feedback link|
| showLegalNav					| --					| Boolean indicating whether to show or hide legal nav|

Dependent elements:
	* jQuery for feedback link popup.



## Installation
`bower install merchant-footer`

## Example Usage
```dust
{>"bower_components/merchant-footer/merchant-footer"
	showMainNav="true"
    showLegalNav="true"
    showFeedback="flase" /}
```

## Locale Support
US, UK, FR, DE & AU

## Instructions
showFeedback - This parameter is used to show the feedback link. This feedback target page is specific to hawk design pages. So make sure to set false for your flow pages. 

And also we should pass account encrypted number, country and local name and value pair data for feedback target page. Make sure to render these JSON model values if feedback link enabling for your flow pages.

#TODO
Use JSON model variable to display copy right content current year.