var Connection = require('./Connection');

function connect(host, port) {
	return new Promise(function(resolve, reject) {
		var connection = new Connection(host, port);

		connection.on('error', reject);
		connection.on('connect', function() {
			//Remove the handler so we dont try to reject on any later errors
			connection.removeListener('error', reject);

			resolve(connection);
		});
	});
}

module.exports = connect;
