nav-consumer
============

This is provides the Dust and LESS for the Consumer-flavor of navigation header links.

## Getting started

1. Install via bower
		```
			bower install --save px-nav-consumer
		```

	This creates a `px-nav-consumer` folder under `public/components`. Component dependencies are installed automatically.
1. Import dependency LESS in your `app.less` (using the relative paths to the component installation):

		@import "../components/px-base/less/px-base.less"; // dependency for paypal branding
		@import "../components/px-grids/less/px-grids.less"; // dependency grid container (used as a mixin in the nav-generic LESS)
		@import "../components/px-nav-generic/less/px-nav-generic.less"; // dependency for nav structure
		@import "../components/px-nav-consumer/less/px-nav-consumer.less"; // consumer nav sprites

1. Include the Dust partial from your layout template:

		{>"components/px-nav-consumer/templates/px-nav-consumer" /}

	Note: Dust does not have the capability to follow relative paths, so as a short-term solution, your project must have symbolic links set up for the component Dust files:

		$ ls -l public/templates/components
		lrwxr-xr-x  1 tsullivan  110001155   32 Feb  5 16:07 px-nav-consumer -> ../../components/px-nav-consumer
		lrwxr-xr-x  1 tsullivan  110001155   31 Feb  5 16:07 px-nav-generic -> ../../components/px-nav-generic

	To create the symbolic links at build time, look into adding a symlink task into your Gruntfile with [grunt-symlink](https://github.com/geddski/grunt-symlink).

## Option to disable notifications

The Notifications component has not been built yet, so there is an option to disable the notifications icon:

	{>"components/px-nav-consumer/templates/px-nav-consumer" px-disable-notifications="true" /}

## Todos / known issues

1. Dust files are not localized.
1. No mobile presentation yet.
1. A "Notifications" component must be built and integrated.

## Issues

For issues, feedback, etc. please submit a pull request or github [issue](https://github.paypal.com/UIE-Components/px-nav-consumer/issues) or you can always contact the [UIE-Components](mailto:DL-PayPal-UIE-Components@corp.ebay.com) DL.
