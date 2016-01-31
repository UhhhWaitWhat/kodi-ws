/* Require the module */
var kodi = require('../');

/* Define a youtube video ID */
var videoId = '-ZOiX6cIT8o';

/* Construct url to play with youtube plugin */
var url = 'plugin://plugin.video.youtube/?action=play_video&videoid=' + videoId;

/* Utility function to stop all active players of a kodi instance */
function stopAllActivePlayers(connection) {
	return connection.Player.GetActivePlayers().then(function(players) {
		/* Stop everything thats playing */
		return Promise.all(players.map(function(player) {
			return connection.Player.Stop(player.playerid);
		}));
	});
}

/* Connect to instance */
kodi('127.0.0.1', 9090).then(function (connection) {
	return stopAllActivePlayers(connection).then(function() {
		/* Start the video */
		return connection.Player.Open({
			item: {
				file: url
			}
		});
	}).then(function() {
		/* Stop the video after 20 seconds */
		return new Promise(function(resolve, reject) {
			setTimeout(function() {
				stopAllActivePlayers(connection).then(resolve, reject);
			}, 20000);
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
