KODI JSON-RPC Websocket client
==============================

This module provides a simple way to communicate with an [Kodi](http://www.kodi.org) media center installation.
It should not be restricted to a specific version of kodi, as it pulls all its information about the available methods from `JSONRPC.Introspect`.

Install via `npm install xbmc-ws`

Initiate
--------
```js
var kodi = require('xbmc-ws');

kodi('localhost', 9090).then(function(connection) {
	/* Do something with the connection */
});
```

Connection Object
-----------------
### Events
The connection object emits the following events:

#### error
Emitted whenever the underlying websocket throws an error.

#### close
Emitted if the underlying socket is closed.

### Methods

#### .notification(method, cb) ###
Assigns a handler to a notfication sent by connection. The `cb` function will be passed a single argument containing the notifications data. `method` should be a string containing the notifications name.

```js
connection.notification('Player.OnPause', function() {
	console.log('Paused');
});
```

**Shorthand:**
```js
connection.Player.OnPause(function() {
	console.log('Paused');
})
```

#### .run(method, args...) ###
Runs the specified method. This function can be passed Parameters:

```js
connection.run('Application.SetMute', true);
```

**Shorthand:**
```js
connection.Application.SetMute(true);
```

The method returns a promise, which will be fulfilled as soon as the server responds.
Multiple arguments can be passed either by order, or as an object by name:

```js
var movies = connection.VideoLibrary.GetMovies(['title', 'rating', 'year'], {"start" : 0, "end": 2});
```

**Arguments by name:**
```js
var movies = connection.VideoLibrary.GetMovies({
	properties: ['title', 'rating', 'year'],
	limits: {"start" : 0, "end": 2}
});
```
