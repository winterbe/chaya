$(function() {
    "use strict";

    var socket = io.connect('/');
    socket.on('pong', function (data) {
        $('#chat .content').append($('<div>' + data.message + '</div>'));
    });
    $('input[type=button]').on('click', function () {
        socket.emit('ping');
    });
});