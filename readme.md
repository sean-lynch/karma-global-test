Test case to make it easy to experiment with `global` variable initialization

### Set up

First time only: `$ npm install`

To run: `$ npm run test`

### Context

In the process of setting up Karma to test our frontend, I ran into issues getting [sinon.js](sinonjs.org) to work correctly. Specifically, sinon's spies let me test if jQuery's ajax() function was being called, but sinon's fake XMLHttpRequest wouldn't catch the requests once fired.

Looking into how jquery and sinon fake server use XMLHttpRequest illustrated the difference

- jQuery: https://github.com/jquery/jquery/blob/master/src/ajax/xhr.js#L11 - uses window.XMLHttpRequest
- sinon: https://github.com/sinonjs/sinon/blob/master/lib/sinon/util/fake_xml_http_request.js#L46 - uses global.XMLHttpRequest

It appears that this is sinon's way of detecting it is being executed inside the browser (another developer who ran into the same issue mentions that in an [issue](https://github.com/sinonjs/sinon/issues/800)).

One of our js modules is creating `window.global` if it doesn't already exist:

    if (window.global == null) { // Generated by coffeescript's ?= operator
      window.global = {};
    }

This is where I ran into weird behavior of karma + phantomjs with respect to how `window` and `window.global` is handled.

In normal operation, the XMLHttpRequest object is available at `global.XMLHttpRequest`. However, if a module that sets `window.global = {};` when `window.global` is not defined is loaded, then XMLHttpRequest doesn't get added to global.

The unanswered question for me is when does `global.XMLHttpRequest` and the rest of global get set during normal initialization? By which tool (Karma or PhantomJS)? And why does that not happen before files are loaded?

### Workarounds

I found that making sure the first file that was loaded was simply `window.global = window;` solved the problem for me (inspired by the example in [karma-injector-preprocessor](https://github.com/mzahor/karma-injector-preprocessor)). [This sinon issue](https://github.com/sinonjs/sinon/issues/826#issuecomment-168404795) has an interesting solution of explicitly assigning the returned fake xhr to global as well.
