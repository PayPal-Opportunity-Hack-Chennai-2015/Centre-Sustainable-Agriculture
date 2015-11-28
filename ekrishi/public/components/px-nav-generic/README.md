nav-generic
==============

This is a generic navigation component that has slots for different products to add
their navigation content.

##Requirements:
(See `bower.json`'s dependencies)
- base-css component
- ar-grids component

##Steps to install in your project:
This component is meant to be used with a wrapper component, such as px-nav-consumer. Typically, the steps to install this component into your project will be to run:
    bower install px-nav-consumer

However, if you have a need to define your own navigation links and actions, you can install this component directly by running:
    bower install px-nav-generic

##Steps to build example code:

1. `git clone` the repo: gets all the code from github.paypal.com.
2. `npm install`: installs the grunt plugins needed for building the example code.
3. `bower install`: installs the UI component dependencies.
4. `grunt build`: builds the example dust file into a page you can see.
5. Open examples/index.html in a browser: makes you happy.

Steps 2 and 4 are optional for anyone who just wants to look at the example
file.  the built examples/index.html file is included as part of the repo. The
base-css dependency is not included as part of this repo, which is why step 3
is required.

To run a server with the example code for testing on mobile or other platforms:
    cd examples
    python -m SimpleHTTPServer [port]

##Todos:

- Integrate the Button component (for sample logout button)

## Issues

For issues, feedback, etc. please submit a pull request or github [issue](https://github.paypal.com/UIE-Components/px-nav-generic/issues) or you can always contact the [UIE-Components](mailto:DL-PayPal-UIE-Components@corp.ebay.com) DL.

## Changelog
0.0.4 Suppress character escaping in strings passed in template paths
0.0.3 Add z-index to keep navigation stacked over page content
