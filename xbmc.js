var jrpc = require('jrpc-schema')
var Websocket = require('ws');
var EventEmitter = require('events').EventEmitter;

//Create our connection
function init(host, port) {
	var queue = [];
	var running = 0;
	var closing = false;

	var connection_id = 'ws://'+host+':'+port+'/jsonrpc';
	var connection;
	
	var events = new EventEmitter();

	jrpc.onId('schemarequest', connection_id, gotSchema);

	var ws;
	
	//Return our new connection object
	return {
		init: _init,
		on: on,
		run: callMethod,
		close: close,
		events: events
	};

	/**********************
		Methods we need
	**********************/

	
	
	function _init() {
		ws = new Websocket(connection_id);

		//Bind our incoming messages to our jrpc handler
		try {
			ws.onmessage = function(data) {
				if(data.data.length>0) {
					try {
						jrpc.handleResponse(connection_id, data.data);
					} catch (e) {
						events.emit('error', e);
						console.error(e);
						closing = true;
					}
				}
			}
			
			ws.onopen = getSchema;
			events.emit('connection');
		} catch (e) {
			events.emit('error', error);
			closing = true;
			close();
		}
		
		ws.on('error', function(error) {
			events.emit('error', error);
			closing = true;
			close();
		});
		
	}
	
	//Return a function to run our method
	function callMethod(method) {
		//Run or queue the message
		return function runMethod() {
			var params = Array.prototype.slice.call(arguments);

			if(typeof params[params.length-1] === 'function') {
				params[params.length-1] = wrapCallback(params[params.length-1]);
			}

			if(connection) {
				connection.methods[method].apply(connection, params);
			} else {
				queue.push({
					method: method,
					params: params
				});
			}
		}
	}

	//Execute all pending requests
	function executeQueue() {
		var method;

		if(connection) {
			while(queue.length > 0) {
				method = queue.shift();
				connection.methods[method.method].apply(connection, method.params);
			}
		}
	}

	function close() {
		if(running !== 0) {
			closing = true;
		} else if(ws) {
			ws.close();
			events.emit('close');
		}
	}

	function wrapCallback(cb) {
		running++;

		return function() {
			cb.apply(null, arguments);

			running--;
			if(closing) {
				close();
			}
		}
	}

	//Get our schema once we have a connection
	function getSchema() {
		var json = jrpc.methodToJSON('JSONRPC.Introspect', [], 'schemarequest');
		ws.send(json, function(error) {
			if(error) {
				events.emit('error', error);
				closing = true;
				close();
			}
		});
	}

	//Generate our jrpc methods from our schema
	function gotSchema(schema) {
		connection = jrpc.parse(schema, ws.send.bind(ws));
		executeQueue();
	}

	//Allow us to bind to a notification
	function on(notification, cb) {
		jrpc.onNotification(notification, connection_id, cb);
	}
}

module.exports = init;