var jrpc = require('jrpc-schema')
var Websocket = require('ws');

//Create our connection
function init(host, port) {
	var queue = [];
	var running = 0;
	var closing = false;

	var connection_id = 'ws://'+host+':'+port+'/jsonrpc';
	var connection;

	jrpc.onId('schemarequest', connection_id, gotSchema);

	var ws = new Websocket(connection_id);

	//Bind our incoming messages to our jrpc handler
	ws.onmessage = function(data) {
		if(data.data.length>0) {
			jrpc.handleResponse(connection_id, data.data);
		}
	}

	ws.onopen = getSchema;

	//Return our new connection object
	return {
		on: on,
		run: callMethod,
		close: close
	};

	/**********************
		Methods we need
	**********************/

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
		ws.send(json);
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