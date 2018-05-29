const express= require('express');
const socketio= require('socket.io');
const http= require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

const mongoose= require('mongoose');


//  db connection
mongoose.connect('mongodb://localhost/chat-database')
 .then(db => console.log('db is connected'))
 .catch(err => console.log(err));


// setting
app.set('port',process.env.PORT || 3000)
require('./sockets')(io);


// archivos staticos
app.use(express.static(path.join(__dirname, 'public')));


// iniciando servidor
server.listen(app.get('port'),() => {
console.log('server');
});

