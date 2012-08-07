$(function () {
    "use strict";

    // use mustache style templates
    _.templateSettings = {
        interpolate:/\{\{(.+?)\}\}/g
    };


    var ContentArea = function() {
        var messageTemplate = _.template('<div class="box">\n    <div class="pic"></div>\n    <div class="msg">\n        <div class="meta">\n            <div class="from">{{nickname}}</div>\n            <div class="time" data-timestamp="{{timestamp}}"></div>\n        </div>\n        <div class="content">{{message}}</div>\n    </div>\n</div>');
        var metaTemplate = _.template('<div class="info"><i class="icon-bell"></i>&nbsp;&nbsp;{{message}}</div>');

        function appendMessage(data) {
            var $entry = $(messageTemplate(data));
            var $time = $entry.find('.time');
            updateTime($time);
            $('#content').append($entry);
            scrollDown();
        }

        function appendInfo(data) {
            var $entry = $(metaTemplate(data));
            var $time = $entry.find('.time');
            updateTime($time);
            $('#content').append($entry);
            scrollDown();
        }

        function updateTimes() {
            $('.time').each(function () {
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


    var Sidebar = function() {
        var userTemplate = _.template('<li data-nickname="{{nickname}}"><i class="icon-user"></i> {{nickname}}</li>');

        function addUser(data) {
            var $li = $(userTemplate(data));
            $('#east ul').append($li);
        }

        function removeUser(nickname) {
            $('#east li[data-nickname=' + nickname + ']').remove();
        }

        return {
            addUser:addUser,
            removeUser:removeUser
        };
    }();


    function connect(nickname) {
        var socket = io.connect('/');

        socket.on('poke', ContentArea.appendMessage);
        socket.on('meta', ContentArea.appendInfo);
        socket.on('user-connected', Sidebar.addUser);
        socket.on('user-disconnected', Sidebar.removeUser);

        socket.emit('whoami', nickname);

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

    window.setInterval(ContentArea.updateTimes, 60000);
});