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

io.sockets.on('connection', function (socket) {
    "use strict";

    socket.on('ping', function (data) {
        var message = { message:data, time:new Date() };
        socket.broadcast.emit('pong', message);
        socket.emit('pong', message);
    });


});
