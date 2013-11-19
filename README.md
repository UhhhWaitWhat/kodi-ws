XBMC JSON-RPC Websocket client
==============================

This module provides a simple way to communicate with an [XBMC](http://www.connection.org) media centre installation.
It should not be restricted to a specific version of xbmc, as it pulls all its information about the available methods from `JSONRPC.Introspect`.

For a full usage example check the example.js file

Install via `npm install xbmc-ws`

Use in Browser
--------------
To use the module in the browser, you can compile it by running `grunt` in the modules folder. This should generate a `compiled.js` file, which you can include in your website like any other javascript file. It adds a `xbmc` property to the `Window` object which you can use as you would use the required module. As this uses the browsers built-in websocket implementation, it will only work with a browser with a working websocket implementation (Firefox 6+, Chrome 14+, Safari 6+, Opera 12+ and IE 10+)


Initiate
--------
	var xbmc = require('xbmc-ws');
	connection = xbmc('localhost', 9090);


Connection Object
-----------------

### .close() ###
Closes our connection, so our program can exit. If any queries are currently running, they will be finished first.

### .on(method, cb) ###
Assigns a handler to a notfication sent by connection. The `cb` function will be passed a single argument containing the notifications data. `method` should be a string containing the notifications name.

### .run(method) ###
Returns a function for the specified method name. This function takes parameters like so:

	connection.run('Application.SetMute')(true, handler);

The handler argument is optional, but if it is supplied, it will be called with the result, as soon as the server responds.
Multiple arguments can be passed either by order, or as an object by name:

	connection.run('VideoLibrary.GetMovies')(['title', 'rating', 'year'], {"start" : 0, "end": 2}, handler);
	connection.methods('VideoLibrary.GetMovies')(
		{
			properties: ['title', 'rating', 'year'],
			limits: {"start" : 0, "end": 2}
		},
		handler);

A handler takes an error as its first argument and the result as its second like so:

	function handler(err, result) {
		if(err) throw err;

		console.log('Movies:', result.movies);
	}

Methods called immediately after initiation are queued as we have to establish a connection and fetch the api info from xbmc first.