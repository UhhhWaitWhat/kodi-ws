var util = require('util');
var jrpc = require('jrpc-schema');
var WebSocket = require('ws');
var EventEmitter = require('events').EventEmitter;
var set = require('set-value');
var has = require('has-value');

function Connection(host, port) {
	EventEmitter.call(this);

	this.socket = new WebSocket('ws://' + host + ':' + port + '/jsonrpc');
	this.closed = true;
	this.init();
}

util.inherits(Connection, EventEmitter);

Connection.prototype.init = function() {
	var self = this;

	this.socket.on('open', function() {
		self.loadSchema().then(function(schema) {
			self.schema = new jrpc.Schema(schema, self.socket.send.bind(self.socket));
			self.socket.on('message', self.schema.handleResponse.bind(self.schema));

			self.addShortcuts();
			self.closed = false;
			self.emit('connect');
		}).catch(function(err) {
			self.emit('error', err);
		});
	});

	this.socket.on('close', function() {
		self.closed = true;
		self.emit('close');
	});

	this.socket.on('error', function(err) {
		self.emit('error', err);
	});
};

Connection.prototype.loadSchema = function() {
	var self = this;
	var fetchSchema = jrpc.run('JSONRPC.Introspect', [], this.socket.send.bind(this.socket));
	this.socket.on('message', fetchSchema.handle);

	return fetchSchema.then(function(schema) {
		self.socket.removeListener('message', fetchSchema.handle);
		return schema;
	});
};

Connection.prototype.addShortcuts = function() {
	var self = this;

	Object.keys(this.schema.schema.methods).forEach(function(method) {
		if(!has(self, method)) {
			set(self, method, self.schema.schema.methods[method]);
		}
	});

	Object.keys(this.schema.schema.notifications).forEach(function(method) {
		if(!has(self, method)) {
			set(self, method, self.schema.schema.notifications[method]);
		}
	});
};

Connection.prototype.run = function(method) {
	if(!this.schema) throw new Error('Connection not initialized!');

	var args = Array.prototype.slice.call(arguments, 1);
	var methods = this.schema.schema.methods;

	return methods[method].apply(method, args);
};

Connection.prototype.notification = function(method, cb) {
	if(!this.schema) throw new Error('Connection not initialized!');

	return this.schema.schema.notifications[method](cb);
};

module.exports = Connection;
