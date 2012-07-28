$(function () {
    "use strict";

    var socket = io.connect('/');

    socket.on('poke', function (data) {
        $('#content').append($('<div class="entry message">' + data.message + '</div>'));
    });

    socket.on('meta', function (data) {
        $('#content').append($('<div class="entry meta">' + data.message + '</div>'));
    });

    $('#south input')
        .on('keyup', function (ev) {
            if (ev.keyCode === 13) {
                var message = $(this).val();
                if (message) {
                    socket.emit('peek', message);
                    $(this).val('');
                }
            }
        })
        .focus();
});