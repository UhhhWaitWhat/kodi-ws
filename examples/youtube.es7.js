/* Import the module */
import kodi from '../';

/* Define a youtube video ID */
const videoId = '-ZOiX6cIT8o';

/* Construct url to play with youtube plugin */
const url = 'plugin://plugin.video.youtube/?action=play_video&videoid=' + videoId;

/* Utility function to delay async execution */
function sleep(ms) {
	return new Promise(res => {
		setTimeout(function() {
			res();
		}, ms);
	});
}

/* Utility function to stop all active players of a kodi instance */
async function stopAllActivePlayers(con) {
	const players = await con.Player.GetActivePlayers();

	await Promise.all(players.map(player => {
		con.Player.Stop(player.playerid);
	}));
}

/* Main logic */
async function main() {
	const con = await kodi('127.0.0.1', 9090);

	/* Stop all players, then start the video */
	await stopAllActivePlayers();
	await con.Player.Open({
		item: {
			file: url
		}
	});

	/* Stop the video after 20 seconds */
	await sleep(20000);
	await stopAllActivePlayers();
}

/* Run the thing */
main().catch(e => {
	/* Handle errors */
	if(e.stack) {
		console.error(e.stack);
	} else {
		console.error(e);
	}
}).then(() => {
	/* Finally exit this process */
	process.exit();
});
