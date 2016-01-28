var kodi = require('../');
kodi('127.0.0.1', 9090).then(function (connection) { /* Do something with the connection */
    connection.Application.SetMute(true);
    setTimeout(function () {
            connection.Application.SetMute(false);
        },
        2500);

});