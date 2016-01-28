var kodi = require('../');
var videoID = 'QH2-TGUlwu4';
var url = "plugin://plugin.video.youtube/?action=play_video&videoid=" + videoID;
kodi('127.0.0.1', 9090).then(function (connection) { /* Do something with the connection */
    stopAllActivePlayers(connection, function () {
        connection.Player.Open({
            item: {
                file: url
            }
        }).then(function () {
            setTimeout(function () {
                stopAllActivePlayers(connection, function () {
                    process.exit();
                })
            }, 20000);
        });
    });
});

function stopAllActivePlayers(connection, cb) {
    connection.Player.GetActivePlayers().then(function (data) {
        for (var key in data)
            connection.Player.Stop(data[key].playerid);
        cb && cb();
    });
}