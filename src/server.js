var express = require("express");
var app = express.createServer();
var io = require('socket.io').listen(app);

if (process.env.PORT) {
    console.log('heroku doesnt support websockets. setting up xhr-polling...');
    io.configure(function () {
        "use strict";
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 10);
    });
}

var port = process.env.PORT || 5000;
app.listen(port);

app.get('/', function (req, res) {
    "use strict";
    res.sendfile(__dirname + '/public/index.html');
});

app.configure(function () {
    "use strict";
    app.use(express.favicon());
    app.use(express.logger());
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({
        dumpExceptions:true,
        showStack:true
    }));
    app.use(app.router);
});

io.sockets.on('connection', function (socket) {
    "use strict";

    // send all users to new user
    io.sockets.clients().forEach(function(otherSocket) {
        otherSocket.get('nickname', function(err, nickname) {
            if (nickname) {
                var data = {
                    nickname:nickname,
                    timestamp:now()
                };
                socket.emit('user-connected', data);
            }
        });
    });

    socket.on('whoami', function(nickname) {
        var data = {
            nickname:nickname,
            timestamp:now()
        };
        socket.broadcast.emit('user-connected', data);
        socket.emit('user-connected', data);

        socket.set('nickname', nickname, function() {
            var message = {
                message: nickname + ' joined',
                timestamp:now()
            };
            socket.emit('meta', message);
            socket.broadcast.emit('meta', message);
        });
    });

    socket.on('peek', function (data) {
        socket.get('nickname', function(err, name) {
            var message = {
                message:data,
                nickname:name,
                gravatar:'2374384343',
                timestamp:now()
            };
            socket.broadcast.emit('poke', message);
            socket.emit('poke', message);
        });
    });

    socket.on('disconnect', function() {
        socket.get('nickname', function(err, nickname) {
            socket.broadcast.emit('user-disconnected', nickname);

            var message = {
                message:nickname + ' left',
                timestamp:now()
            };
            socket.emit('meta', message);
            socket.broadcast.emit('meta', message);
        });
    });

});

function now() {
    "use strict";
    return new Date().getTime();
}
