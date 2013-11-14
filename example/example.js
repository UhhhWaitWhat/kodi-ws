var xbmc = require('../xbmc.js');

xbmc('192.111.111.106', 9090, loaded);

function loaded(err, xbmc) {
	if(err) throw err;

	//Attach a callback to a notification
	xbmc.on('Application.OnVolumeChanged', volume);

	//Toggle mute state to show that notifications work
	xbmc.methods['Application.SetMute'](true);
	xbmc.methods['Application.SetMute'](false);

	//Request 10 movies
	xbmc.methods['VideoLibrary.GetMovies'](['title', 'rating', 'year'], {"start" : 0, "end": 2}, movies.bind(xbmc));
}

function volume(data) {
	console.log('Volume Change')
	console.log('-------------')
	console.log('Volume At:', data.data.volume);
	console.log('Mute State is:', data.data.muted, '\n');
}

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

	this.close();
}