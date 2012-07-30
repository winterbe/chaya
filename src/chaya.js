$(function () {
    "use strict";

    $('#nickname input')
        .focus()
        .on('keyup', function (ev) {
            if (ev.keyCode === 13) {
                var nickname = $(this).val();
                if (nickname) {
                    connect(nickname);
                }
            }
        });

//    connect('test');

    function connect(nickname) {
        var socket = io.connect('/');

        socket.emit('whoami', nickname);

        socket.on('poke', function (data) {
            var msg = data.nickname + ': ' + data.message;
            $('#content').append($('<div class="entry message">' + msg + '</div>'));
            $('html, body').prop('scrollTop', $(document).height());
        });

        socket.on('meta', function (data) {
            $('#content').append($('<div class="entry meta">' + data.message + '</div>'));
        });

        $('#nickname').hide();
        $('#chat').show();

        $('#south input')
            .focus()
            .on('keyup', function (ev) {
                if (ev.keyCode === 13) {
                    var message = $(this).val();
                    if (message) {
                        socket.emit('peek', message);
                        $(this).val('');
                    }
                }
            });
    }
});