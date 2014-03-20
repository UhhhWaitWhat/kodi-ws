var xbmc = require('../xbmc.js');
var connection = xbmc('192.111.111.106', 9090);		

connection.events.on('close', function xbmc_close() {
	console.info("XBMC Close. reconect 1s...");
	setTimeout(connection.init, 1000);
});	

connection.events.on('error', function xbmc_error(error) {
	console.error("XBMC error");
	console.error(error);
});	

connection.events.on('connection', function xbmc_connection() {
	console.info("XBMC connection");
});

function xbmc_reg_notifications(name) {
	connection.on(name, function xbmc_notifications(data) {
		console.info(name);
		console.debug(data.data);
	});
}

xbmc_reg_notifications('Application.OnVolumeChanged');	

xbmc_reg_notifications('Player.OnPause');
xbmc_reg_notifications('Player.OnPlay');
xbmc_reg_notifications('Player.OnPropertyChanged');
xbmc_reg_notifications('Player.OnSeek');
xbmc_reg_notifications('Player.OnSpeedChanged');
xbmc_reg_notifications('Player.OnStop');

xbmc_reg_notifications('Playlist.OnAdd');
xbmc_reg_notifications('Playlist.OnClear');
xbmc_reg_notifications('Playlist.OnRemove');

xbmc_reg_notifications('System.OnLowBattery');
xbmc_reg_notifications('System.OnQuit');
xbmc_reg_notifications('System.OnRestart');
xbmc_reg_notifications('System.OnSleep');
xbmc_reg_notifications('System.OnWake');

connection.init();


//Bind a handler to the onvolumechange notification
connection.on('Application.OnVolumeChanged', volume);

//Toggle mute state to show that notifications work
connection.run('Application.SetMute')(true);
connection.run('Application.SetMute')(false);

//Request 10 movies
connection.run('VideoLibrary.GetMovies')(['title', 'rating', 'year'], {start: 0, end: 5}, {method: 'rating', order: 'descending'}, movies);

//Finally close our connection
connection.close();

//Output our volume
function volume(data) {
	console.log('Volume Change')
	console.log('-------------')
	console.log('Volume At:', data.data.volume);
	console.log('Mute State is:', data.data.muted, '\n');
}

//Output our movies
function movies(err, result) {
	var x;
	if(err) throw err;

	console.log('Movies:');
	console.log('--------------------');

	for(x = 0; x < result.movies.length; x++) {
		console.log('\n  '+result.movies[x].title);
		console.log('  '+'------------------');
		console.log('  '+'Rating:        '+ result.movies[x].rating.toFixed(1));
		console.log('  '+'Year:         '+ result.movies[x].year);
	}
}











