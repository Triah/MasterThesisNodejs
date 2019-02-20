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
      for(var res in result){
        if(result[res].Name == name){
          canvasObjects[res] = result[res];
          callback(null, canvasObjects);
        }
      }
    }
  });
}


// This method uses a callback to find the users in a specific room
function getUsersInRoom(roomname, users,callback){
  mongoDbActions.getUsersInRoom(MongoClient,dbPath,roomname,users, function(err, result){
    if(err != null){
      callback(err, null);
    } else {
      callback(null, result);
    }
  })
}

//This method uses a callback to add a user to the room
function addUserToRoom(roomname, user, users){
  mongoDbActions.addUserToGameRoom(MongoClient,dbPath,roomname,user,users)
}


//this method is for adding a room for a game, this is supposed to happen
//when the capacity of all rooms with the name of the game are filled with players
function addRoomForGame(roomname, game, capacity, users){
  mongoDbActions.addGameRoom(MongoClient,dbPath,game,roomname,capacity,users);
}

//Uses a callback to the the rooms for a specific game
function getGameRoomsForGame(name, callback){
  mongoDbActions.getCurrentRoomsForGame(MongoClient, dbPath, name, function(err, result){
    if(err != null){
      console.log(err);
    } else {
      console.log(result);
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
        gameName: gameName
      };
      var userList = []

      //Find out how many users are in the room this has an error of not clearing the list currently
      getUsersInRoom(players[socket.id].gameName + "1",userList, function(err, result){
        if(err != null){}
        else {
          //get capacity here instead of 3
          //also needs to run through the entire list of possible rooms for the game and check the currently available slots
          if(userList.length < 3){
            //adds the user to the room that is available
            addUserToRoom(players[socket.id].gameName + "1", "newUser", userList);
            //makes sure the socket joins the room with the same name as the room in mongo
            //socket.join(players[socket.id].gameName + "1");
          } else {
            //This needs to make a new room if there are none available
            console.log("too many users in room");
          }
        }
      });
      
      //TESTING METHODS
      //mongoDbActions.deleteGameRoomsEntry(MongoClient,dbPath);
      //addUserToRoom(gameName + "1", "newUser", getUsersInRoom(gameName + "1", userList));
      //getUsersInRoom(gameName + "1",userList);
      //userList.push(players[socket.id].username);
      //addRoomForGame(gameName + "1", gameName, 3, userList);
      //getGameRoomsForGame(gameName, null);
      socket.join(gameName);
      //END OF TESTING METHODS

      initCanvasObjects(gameName, function(err, canvasObjectsVar){
        if(err != null){}
        else{
          socket.emit('initObjects', canvasObjectsVar);
        }
      });
      username = null;
      gameName = null;
    }
    else {
      players[socket.id] = {
        x: 300,
        y: 300
      };
      initCanvasObjects("TestGame", function(err, canvasObjectsVar){
        if(err != null){}
        else{
          socket.emit('initObjects', canvasObjectsVar);
        }
      });
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
    io.to(players[socket.id].gameName).emit('updateItemPositionDone', lockedItem);
  });

  socket.on('disconnect', function () {
    delete players[socket.id]
  });
});

setInterval(function () {
  io.sockets.emit('state', players);
}, 1000 / 60);