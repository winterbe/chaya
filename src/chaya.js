$(function () {
    "use strict";

    // use mustache style templates
    _.templateSettings = {
        interpolate:/\{\{(.+?)\}\}/g
    };

    // for testing only
//    connect('Peter Parker');


    var gravatarTemplate = _.template('http://www.gravatar.com/avatar/{{gravatar}}?s=36&d=mm&f=y');

    var messageTemplate = _.template(
        '<div class="entry"><img src=""/><div class="from">{{nickname}}</div><div class="msg">{{message}}</div></div>'
    );


    function appendMessage(data) {
//        var gravatarUrl = gravatarTemplate(data);
        var $entry = $(messageTemplate(data));
//        $entry.css('background', 'url(' + gravatarUrl + ') no-repeat');

        $('#content').append($entry);
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