# KODI JSON-RPC Websocket client
This module provides a simple way to communicate with an [Kodi](http://kodi.tv) media center installation.
It should not be restricted to a specific version of kodi, as it pulls all its information about the available methods from `JSONRPC.Introspect`.

Install via `npm install kodi-ws`

## Initiate
```js
var kodi = require('kodi-ws');

kodi('localhost', 9090).then(function(connection) {
	/* Do something with the connection */
});
```

## Connection Object
### Events
The connection object emits the following events:

#### error
Emitted whenever the underlying websocket throws an error or a server response cannot be parsed.

#### close
Emitted if the underlying socket is closed.

### Methods
#### .notification(method, cb)
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

#### .run(method, args...)
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

##### Batch Requests
You can send batch requests like so:

```js
var batch = connection.batch();

var movies = batch.VideoLibrary.GetMovies({properties: ['title']});
var shows = batch.VideoLibrary.GetTVShows({properties: ['title']});

batch.send();

Promise.all([movies, shows]).then(function(data) {
	/* Movies */
	console.log(data[0]);
	/* TVShows */
	console.log(data[1]);
});
```

Notice the `Promise.all()` is optional and used here to have simpler sample code.

## Await/Async Example
And just for good measure an example which uses ES7 `async` functions.

```js
let kodi = require('kodi-ws')('localhost', 9090);

async function doStuff() {
	let con = await kodi;

	console.log(await con.VideoLibrary.GetMovies({properties: ['title']}));
	console.log(await con.VideoLibrary.GetTVShows({properties: ['title']}));
}

doStuff().catch(e => console.error(e));
```

## More examples
Look for more examples in the [examples](examples) directory.

## Kodi's JSON-RPC API
You can find kodi's official documentation of the JSON-RCP API [here](http://kodi.wiki/view/JSON-RPC_API) and the full list of available commands (for protocol version 6) [here](http://kodi.wiki/view/JSON-RPC_API/v6).
