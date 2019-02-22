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
var gameName;
app.post('/', function (req, res) {
  username = req.body.email;
  gameName = req.body.gameName;
  res.send(res.header);
});

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});

// Starts the server.
server.listen(5000, function () {
  console.log('Starting server on port 5000');
});

//######################################
var canvasObjects = {}

//canvasObjects[0] = {id: 0, bounds: [{x:100,y:100},{x:100,y:150},{x:150,y:200}], moveAble: true, collideAble: true, targetAble:true};
//canvasObjects[1] = {id: 1, bounds: [{x:400,y:400},{x:700, y:400}, {x: 700, y:700}, {x:400,y:700}],moveAble:true, collideAble:true, targetAble: true};


function initCanvasObjects(name, callback) {
  mongoDbActions.getComponentsForGame(MongoClient, dbPath, name, function (err, result) {
    if (err != null) {
      console.log(err);
      callback(err, null);
    } else {
      canvasObjects = {};
      for (var res in result) {
        if (result[res].Name == name) {
          canvasObjects[res] = result[res];
          callback(null, canvasObjects);
        }
      }
    }
  });
}

function getGames(callback) {
  mongoDbActions.findAllGames(MongoClient, dbPath, function (err, result) {
    if (err != null) { callback(err, null) }
    else {
      callback(null, result)
    }
  })
}

// This method uses a callback to find the users in a specific room
function getUsersInRoom(game, users, callback) {
  mongoDbActions.getUsersInRoom(MongoClient, dbPath, users, game, function (err, result) {
    if (err != null) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  })
}

//This method uses a callback to add a user to the room
function addUserToRoom(roomname, user, users) {
  mongoDbActions.addUserToGameRoom(MongoClient, dbPath, roomname, user, users);
}


//this method is for adding a room for a game, this is supposed to happen
//when the capacity of all rooms with the name of the game are filled with players
function addRoomForGame(roomname, game, capacity, users, callback) {
  mongoDbActions.addGameRoom(MongoClient, dbPath, game, roomname, capacity, users, function (err, result) {
    if (err != null) { console.log(err); }
    else {
      callback(null, result);
    }

  });
}

//Uses a callback to the the rooms for a specific game
function getGameRoomsForGame(game, callback) {
  mongoDbActions.getCurrentRoomsForGame(MongoClient, dbPath, name, function (err, result) {
    if (err != null) {
      callback(err, null);
    } else {
      var roomsList = [];
      for(var i = 0; i < result.length; i++){
        if(result[i].game == game){
          roomsList.push(result[i]);
        }
      }
      callback(null, roomsList);
    }
  })
}


//Websocket actions
var players = {};
io.on('connection', function (socket) {
  socket.on('new player', function () {
    //TODO: check for rooms that are available given the gameinfo
    if (username != null) {

      players[socket.id] = {
        username: username,
        gameName: gameName,
        roomname: undefined
      };

      var userList = []
      getUsersInRoom(players[socket.id].gameName, userList, function (err, result) {
        if (err != null) {
          getGames(function (err, result) {
            if (err != null) {
            } else {
              for (var i = 0; i < result.length; i++) {
                if (result[i].Name == players[socket.id].gameName) {
                  addRoomForGame(String(players[socket.id].gameName + 1), players[socket.id].gameName, result[i].Capacity, userList, function (err, result) {
                    socket.join(result.roomname);
                    players[socket.id].roomname = result.roomname;
                    addUserToRoom(result.roomname, players[socket.id].username, result.users);
                  });
                }
              }
            }
          })
          //If this error is triggered it is due to no rooms existing in mongo so we create the first room with the given name

        }
        else {
          //rooms are already existing so we run through them
          for (var i = 0; i < result.length; i++) {
            //if the room is not full, just add to the latest room
            if (result[i].users.length < result[i].capacity) {
              //add the user in the database
              //TODO: check the database for the username to place the user in the original room upon reconnects
              addUserToRoom(result[i].roomname, players[socket.id].username, result[i].users);
              //join the socket to the room the user was assigned
              socket.join(result[i].roomname)
              //set the roomname of the player to have consistency among players
              players[socket.id].roomname = result[i].roomname;
              //breaking out of the loop to avoid adding the user to multiple rooms
              break;
              //this else if is entered when the last room is full to make a new room and add the player to that one
            } else if (result[i].users.length == result[i].capacity && i == result.length - 1) {
              addRoomForGame(String(result[i].game + (result.length + 1)), players[socket.id].gameName, result[i].capacity, userList, function (err, result) {
                socket.join(result.roomname);
                players[socket.id].roomname = result.roomname;
                addUserToRoom(result.roomname, players[socket.id].username, result.users);
              });
            }
          }
        }
      });

      initCanvasObjects(gameName, function (err, canvasObjectsVar) {
        if (err != null) { }
        else {
          socket.emit('initObjects', canvasObjectsVar);
        }
      });
      username = null;
      gameName = null;
    }
  });

  socket.on('updateItemPosition', function (lockedItem) {
    for (var v in canvasObjects) {
      if (JSON.parse(canvasObjects[v].Components).id == lockedItem.id) {
        for (var update in lockedItem) {
          canvasObjects[v][update] = lockedItem[update];
        }
      }
    }
    io.to(players[socket.id].roomname).emit('updateItemPositionDone', lockedItem);
  });

  //TODO: make a timer for the disconnection which allows the user to reconnect within a minute.
  socket.on('disconnect', function () {
    delete players[socket.id]
  });
});

setInterval(function () {
  io.sockets.emit('state', players);
}, 1000 / 60);