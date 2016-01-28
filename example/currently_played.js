var kodi = require('../');
kodi('127.0.0.1', 9090).then(function (connection) { /* Do something with the connection */
    connection.Player.GetActivePlayers().then(function (data) {
        console.log('Active players:');
        console.log(JSON.stringify(data));
        for (var key in data)
            getCurrentlyPlayed(data[key].playerid, connection);
    });
});

function getCurrentlyPlayed(playerid, connection) {
    connection.Player.GetItem(playerid).then(function (data) {
        console.log('Currently played for player[' + playerid + ']:');
        console.log(JSON.stringify(data));
    });
}