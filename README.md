XBMC JSON-RPC Websocket client
==============================

This module provides a simple way to communicate with an [XBMC](http://www.connection.org) media centre installation.
It should not be restricted to a specific version of xbmc, as it pulls all its information about the available methods from `JSONRPC.Introspect`.

For a full usage example check the example.js file


Initiate
--------
	var xbmc = require('xbmc-ws');
	xbmc('localhost', 9090, loaded);

As we have to fetch info about the xbmc instance first, we have to assign a callback to our connecting function. This callback will then be called with an error if any as its first argument, and a connection object as its second.

	function loaded(err, connection) {
		if(err) throw err;
		//Do something with our connection object
	}


Connection Object
-----------------

### .version ###
The version reported by `JSONRPC.Introspect`

### .close() ###
Close our connection, so our program can exit

### .on(method, cb) ###
Assigns a handler to a notfication sent by connection. The `cb` function will be passed a single argument containing the notifications data. `method` should be a string containing the notifications name.

### .methods ###
This object contains all of the methods we can send to connection. You can call them like so:

	connection.methods['Application.SetMute'](true, handler);

The handler argument is optional, but if it is supplied, it will be called with the result, as soon as the server responds.
Multiple arguments can be passed either by order, or as an object by name:

	connection.methods['VideoLibrary.GetMovies'](['title', 'rating', 'year'], {"start" : 0, "end": 2}, handler);
	connection.methods['VideoLibrary.GetMovies'](
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