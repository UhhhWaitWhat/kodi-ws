/* Require the module */
var kodi = require('../');

/* Instantiate the connection and wait */
kodi('127.0.0.1', 9090).then(function (connection) {
	/* Mute */
	return connection.Application.SetMute(true).then(function() {
		/* Unmute 2,5 seconds later */
		return new Promise(function(res, rej) {
			setTimeout(function () {
				connection.Application.SetMute(false).then(res, rej);
			}, 2500);
		});
	});
}).catch(function(e) {
	/* Handle errors */
	if(e.stack) {
		console.error(e.stack);
	} else {
		console.error(e);
	}
}).then(function() {
	/* Finally exit this process */
	process.exit();
});
