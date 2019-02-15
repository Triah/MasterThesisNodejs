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

//Create rooms for the players to enter dynamically with a recursive method
//mongoDbActions.createRoom(MongoClient, dbPath, "TestRoom2");
//mongoDbActions.findAllGames(MongoClient,dbPath);

/*
function promiseTest(){
  MongoClient.connect(dbPath).then(function(db){
    db.db("MasterThesisMongoDb").collection("Games").findOne({}, function(err, data){
      canvasObjects[0] = data.Components;
    })
    
  })
  .catch(function(err){})
}
*/
function initCanvasObjects(name, callback) {
  mongoDbActions.getComponentsForGame(MongoClient, dbPath, name, function (err, result) {
    if (err != null) {
      console.log(err);
      callback(err, null);
    } else {
      canvasObjects[0] = result[0].Components;
      callback(null, canvasObjects);
    }

  });
}



//mongoDbActions.deleteGameEntry(MongoClient, dbPath);


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
      username = null;
      gameName = null;
      console.log(players[socket.id]);
    }
    else {
      players[socket.id] = {
        x: 300,
        y: 300
      };
      initCanvasObjects("TestGame", function(err, canvasObjectsVar){
        if(err != null){}
        else{
          console.log("printing canvas obj var: " + canvasObjectsVar[0]);
          socket.emit('initObjects', canvasObjectsVar);
        }
      });
    }
    
  });

  

  socket.on('updateItemPosition', function (lockedItem) {
    for (let v in canvasObjects) {
      if (v == lockedItem.id) {
        for (var update in lockedItem) {
          canvasObjects[v][update] = lockedItem[update];
        }
        io.sockets.emit('updateItemPositionDone', lockedItem);
      }
    }
  });

  socket.on('disconnect', function () {
    delete players[socket.id]
  });
});

setInterval(function () {
  io.sockets.emit('state', players);
}, 1000 / 60);