// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var mongoDbActions = require('./static/mongoDBActions');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
const dbPath = "mongodb://localhost:27017/";
var bodyParser = require('body-parser');

var corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

var username;
app.post('/', function(req, res){
  username = req.body.email;
  res.send(res.header);
});

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

/*
mongoDbActions.createRoom(MongoClient, dbPath, "TestRoom2");
mongoDbActions.findAllRooms(MongoClient,dbPath);
*/


//Websocket actions
var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    if(username != null){
      players[socket.id] = {
      username: username,
      x: 300,
      y: 300
    };
    console.log(players[socket.id]);
    }
    
  });

  socket.on('disconnect', function() {
    delete players[socket.id]
  }); 
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);