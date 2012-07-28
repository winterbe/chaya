$(function() {
    "use strict";

    var socket = io.connect('/');
    socket.on('pong', function (data) {
        $('#chat .content').append($('<div>' + data.message + '</div>'));
    });
    $('input[type=button]').on('click', function () {
        var message = $('input[type=text]').val();
        if (message) {
            socket.emit('ping', message);
        }
    });
});