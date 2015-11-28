# px-base

Base is your starting point for styling your application. In a nuthsell, base will normalized your css baseline, and provide baseline for all your colors, typography, headers and elements. See it in action [here]().

## Getting started:

1. Install via bower

```
  bower install px-base
```

This creates a "px-base" folder under your public/components/ folder.


2. Import `px-base.less` from public/css/app.less on your application

```
@import '../components/px-base/less/px-base.less';
```


### `px-base.less` is a PayPal flavored version of bootstrap base less file, and it contains:

 * [Normalize.css](http://necolas.github.io/normalize.css/): It provides a base reset.
 * **variables** : Constant definitions of things like color codes, fonts, etc.
 * **mixins** : Provides helpers and reusable code, that the rest of the components use.
 * **scaffolding** : It contains a few basic rules to generic elements, anchors, body tag, etc.
 * **type**: Set common font settings, line-heights, and colors.
 * **utilities** : It provides helpers like hide/show, clearfix, etc..


## Issues

For issues, feedback, etc. please submit a pull request or github [issue](https://github.paypal.com/UIE-Components/px-base/issues) or you can always contact the [UIE-Components](mailto:DL-PayPal-UIE-Components@corp.ebay.com) dl.
