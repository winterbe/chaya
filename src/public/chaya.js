$(function () {
    "use strict";

    // use mustache style templates
    _.templateSettings = {
        interpolate:/\{\{(.+?)\}\}/g
    };


    var Settings = {
        title: 'CHAYA',
        subtitle: 'An HTML5 Web Chat'
    };


    var Templates = {
        main:_.template('<div id="chaya">\n    <div class="titlebar">\n        <div class="brand" title="{{subtitle}}">{{title}}</div>\n    </div>\n\n    <div class="sidebar">\n        <h3>CONNECTED USERS</h3>\n        <ul></ul>\n    </div>\n\n    <div class="content"></div>\n\n    <div class="actionbar">\n        <div class="pic"></div>\n        <div class="wrapper">\n            <input type="text" placeholder="Leave a message...">\n        </div>\n    </div>\n</div>'),
        connect:_.template('<div id="connect">\n    <h1>{{title}}</h1>\n\n    <h3>{{subtitle}}</h3>\n    <input type="text" placeholder="Choose your nickname">\n</div>\n\n<a id="ribbon" href="https://github.com/winterbe/chaya">\n    <img class="github-ribbon"\n         src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub">\n</a>'),
        chatMessage:_.template('<div class="box">\n    <div class="pic"></div>\n    <div class="msg">\n        <div class="meta">\n            <div class="from">{{nickname}}</div>\n            <div class="time" data-timestamp="{{timestamp}}"></div>\n        </div>\n        <div class="chat-msg">{{message}}</div>\n    </div>\n</div>'),
        chatInfo:_.template('<div class="info"><i class="icon-bell"></i>&nbsp;&nbsp;{{message}}</div>'),
        userEntry:_.template('<li data-nickname="{{nickname}}"><i class="icon-user"></i> {{nickname}}</li>')
    };


    var ContentArea = function () {

        function appendMessage(data) {
            var $entry = $(Templates.chatMessage(data));
            var $time = $entry.find('.time');
            updateTime($time);
            $('#chaya .content').append($entry);
            scrollDown();
        }

        function appendInfo(data) {
            var $entry = $(Templates.chatInfo(data));
            var $time = $entry.find('.time');
            updateTime($time);
            $('#chaya .content').append($entry);
            scrollDown();
        }

        function updateTimes() {
            $('#chaya .content .time').each(function () {
                updateTime($(this));
            });
        }

        function updateTime($time) {
            var timestamp = $time.data('timestamp');
            var fromNow = moment(timestamp).fromNow();
            $time.text(fromNow);
        }

        function scrollDown() {
            $('html, body').prop('scrollTop', $(document).height());
        }

        return {
            appendMessage:appendMessage,
            appendInfo:appendInfo,
            updateTimes:updateTimes
        };
    }();


    var Sidebar = function () {

        function addUser(data) {
            var $li = $(Templates.userEntry(data));
            $('#chaya .sidebar ul').append($li);
        }

        function removeUser(nickname) {
            $('#chaya .sidebar li[data-nickname=' + nickname + ']').remove();
        }

        return {
            addUser:addUser,
            removeUser:removeUser
        };
    }();


    //
    // Initialize Chaya View
    //

    function connect(nickname) {
        var socket = io.connect('/');

        socket.on('poke', ContentArea.appendMessage);
        socket.on('meta', ContentArea.appendInfo);
        socket.on('user-connected', Sidebar.addUser);
        socket.on('user-disconnected', Sidebar.removeUser);

        socket.emit('whoami', nickname);


        $('#connect').addClass('hidden');

        window.setTimeout(function () {
            $('#ribbon').hide();
            $('#connect').hide();
            $('#chaya').show().find('input').focus();
        }, 800);


        $('#chaya .actionbar input')
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


    $('body').append($(Templates.connect(Settings)));
    $('body').append($(Templates.main(Settings)));

    $('#connect input')
        .focus()
        .on('keyup', function (ev) {
            if (ev.keyCode === 13) {
                var nickname = $(this).val();
                if (nickname) {
                    connect(nickname);
                }
            }
        });

    window.setInterval(ContentArea.updateTimes, 60000);

    // show connect layer animated
    window.setTimeout(function () {
        $('#connect').addClass('shown');
    }, 400);
});