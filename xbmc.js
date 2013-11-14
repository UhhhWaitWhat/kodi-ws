var jrpc = require('jrpc-schema');
var Websocket = require('ws');

function connect(ip, port, cb) {
	var connection_id = 'ws://'+ip+':'+port+'/jsonrpc'

	var ws = new Websocket(connection_id);

	//Bind our incoming messages to our jrpc handler
	ws.on('message',  function(msg) {
		if(typeof msg === 'string' && msg.length > 0) {
			jrpc.handleResponse(connection_id, msg);
		}
	});


	//Get our schema once we have a connection
	var getSchema = function() {
		var json = jrpc.methodToJSON('JSONRPC.Introspect', [], 'schemarequest');
		ws.send(json);
	}

	//Generate our jrpc methods from our schema
	var gotSchema = function(schema) {
		try {
			xbmc = {
				methods: jrpc.parse(schema, ws.send.bind(ws)).methods,
				on: function(notification, cb) {
					jrpc.onNotification(notification, connection_id, cb);
				},
				close: ws.close.bind(ws),
				version: schema.version
			};
		} catch(e) {
			cb(e);
			return;
		}

		cb(null, xbmc);
	};

	//After the socket is open, make sure we request the schema
	ws.on('open', getSchema);
	jrpc.onId('schemarequest', connection_id, gotSchema);
}

module.exports = connect;
