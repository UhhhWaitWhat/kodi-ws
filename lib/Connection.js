var util = require('util');
var jrpc = require('jrpc-schema');
var WebSocket = require('ws');
var EventEmitter = require('events').EventEmitter;
var set = require('set-value');
var has = require('has-value');

function Connection(host, port) {
	EventEmitter.call(this);

	this.host = host;
	this.port = port;
	this.url = 'ws://' + host + ':' + port + '/jsonrpc';
	this.socket = new WebSocket(this.url);
	this.closed = true;
	this.init();
}

util.inherits(Connection, EventEmitter);

Connection.prototype.init = function() {
	var self = this;

	this.socket.on('message', self.handleResponse.bind(self));

	this.socket.on('open', function() {
		self.loadSchema().then(function() {
			self.addShortcuts();
			self.closed = false;
			self.emit('connect');
		}, function(err) {
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

Connection.prototype.handleResponse = function(data) {
	jrpc.handleResponse(this.url, data);
};

Connection.prototype.loadSchema = function() {
	var self = this;
	return new Promise(function(resolve) {
		var request = jrpc.methodToJSON('JSONRPC.Introspect', [], 'schemarequest');
		self.socket.send(request);

		jrpc.onId('schemarequest', self.url, function(schema) {
			self.schema = jrpc.parse(schema, self.socket.send.bind(self.socket));
			resolve();
		});
	});
};

Connection.prototype.run = function() {
	var self = this;
	var args = Array.prototype.slice.call(arguments);

	if(this.closed) throw new Error('Connection is closed');

	return new Promise(function(resolve, reject) {
		args.push(function(err, res) {
			if(err) return reject(err);

			resolve(res);
		});

		self.schema.methods[args.shift()].apply(null, args);
	});
};

Connection.prototype.notification = function(type, cb) {
	jrpc.onNotification(type, this.url, cb);
};

Connection.prototype.addShortcuts = function() {
	var self = this;

	Object.keys(this.schema.methods).forEach(function(method) {
		if(!has(self, method)) {
			set(self, method, self.run.bind(self, method));
		}
	});

	Object.keys(this.schema.notifications).forEach(function(method) {
		if(!has(self, method)) {
			set(self, method, self.notification.bind(self, method));
		}
	});
};

module.exports = Connection;
