var app = require('express').createServer();
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
    res.sendfile(__dirname + '/index.html');
});

app.get('/chaya.css', function (req, res) {
    "use strict";
    res.sendfile(__dirname + '/chaya.css');
});

app.get('/chaya.js', function (req, res) {
    "use strict";
    res.sendfile(__dirname + '/chaya.js');
});

app.get('/underscore-min.js', function (req, res) {
    "use strict";
    res.sendfile(__dirname + '/underscore-min.js');
});

io.sockets.on('connection', function (socket) {
    "use strict";

    socket.on('whoami', function(nickname) {
        socket.set('nickname', nickname, function() {
            var message = { message:nickname + ' connected', time:new Date() };
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
                time:new Date()
            };
            socket.broadcast.emit('poke', message);
            socket.emit('poke', message);
        });
    });

    socket.on('disconnect', function() {
        socket.get('nickname', function(err, name) {
            var message = { message:name + ' disconnected', time:new Date() };
            socket.emit('meta', message);
            socket.broadcast.emit('meta', message);
        });
    });

});
