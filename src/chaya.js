$(function () {
    "use strict";

    // use mustache style templates
    _.templateSettings = {
        interpolate:/\{\{(.+?)\}\}/g
    };

    // for testing only
//    connect('Peter Parker');


    var messageTemplate = _.template(
        '<div class="entry"><div class="from">{{nickname}}</div><div class="msg">{{message}}</div></div>'
    );


    function appendMessage(data) {
        $('#content')
            .append($(messageTemplate(data)));
        scrollDown();
    }


    function scrollDown() {
        $('html, body').prop('scrollTop', $(document).height());
    }

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

    function connect(nickname) {
        var socket = io.connect('/');

        socket.emit('whoami', nickname);

        socket.on('poke', appendMessage);

//        socket.on('meta', function (data) {
//            $('#content').append($('<div class="entry meta">' + data.message + '</div>'));
//        });

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