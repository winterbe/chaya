var app = require('express').createServer();
var io = require('socket.io').listen(app);

var port = process.env.PORT || 5000;
app.listen(port);

app.get('/', function (req, res) {
    "use strict";

    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    "use strict";

    socket.on('ping', function (data) {
        socket.emit('pong', { message:'Pong: ' + new Date() });
    });


});
