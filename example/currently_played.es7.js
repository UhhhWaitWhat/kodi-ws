/* Import the module */
import kodi from '../';

/* Main logic */
async function main() {
	const con = await kodi('127.0.0.1', 9090);

	/* Get all active players and log them */
	const players = await con.Player.GetActivePlayers();
	console.log('Active players:');
	console.log(JSON.stringify(players));

	/* Log the currently played item for all players */
	for(let player of players) {
		let item = await con.Player.GetItem(player.playerid);
		console.log('Currently played for player[' + player.playerid + ']:');
		console.log(JSON.stringify(item));
	}
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
