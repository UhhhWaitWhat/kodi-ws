/* Import the module */
import kodi from '../';

/* Utility function to delay async execution */
function sleep(ms) {
	return new Promise(res => {
		setTimeout(function() {
			res();
		}, ms);
	});
}

/* Main logic */
async function main() {
	const con = await kodi('127.0.0.1', 9090);

	/* Mute kodi */
	await con.Application.SetMute(true);

	/* Wait 2,5 seconds */
	await sleep(2500);

	/* Unmute kodi */
	await con.Application.SetMute(false);
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
