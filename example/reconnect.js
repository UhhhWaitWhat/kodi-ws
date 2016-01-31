var kodi = require('../');
var videoID = 'QH2-TGUlwu4';
var url = "plugin://plugin.video.youtube/?action=play_video&videoid=" + videoID;

var host = '127.0.0.1';
var port = 9090;

doStuff();

function doStuff() {
    console.log('Connecting to: ' + host + ':' + port);
    kodi(host, port).then(function (connection) { /* Do something with the connection */
        console.log('Successfully connected!');

        //JSONRPC.Ping

        connection.on('error', function (cause) {
            console.log('Kodi event[error], cause: ' + cause);
        });
        connection.on('close', function (cause) {
            console.log('Kodi event[close], cause: ' + cause);
        });
        connection.on('end', function (cause) {
            console.log('Kodi event[end], cause: ' + cause);
        });

        connection.JSONRPC.Ping().then(function (pong) {
            console.log('Ping success, pong[' + pong + ']');
        }, function (error) {
            console.log('Ping failed, error[' + error + ']');
        });

        connection.System.OnSleep(function () {
            console.log('Kodi OnSleep');
        });
        connection.System.OnLowBattery(function () {
            console.log('Kodi OnLowBattery');
        });

    }, function (error) {
        console.log('Error connecting, cause: ' + error);
        setTimeout(doStuff, 5000);
    });
}


function stopAllActivePlayers(connection, cb) {
    connection.Player.GetActivePlayers().then(function (data) {
        for (var key in data)
            connection.Player.Stop(data[key].playerid);
        cb && cb();
    });
}