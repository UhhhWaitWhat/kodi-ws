var Connection = require('./Connection');

function connect(host, port) {
	return new Promise(function(resolve, reject) {
		var connection = new Connection(host, port);

		connection.on('error', reject);
		connection.on('connect', function() {
			resolve(connection);

			//Remove the handler so we dont try to reject on any later errors
			connection.removeHandler('error', reject);
		});
	});
}

module.exports = connect;
