// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var mongoDbActions = require('./static/mongoDBActions');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var fs = require('fs');

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
//Handle HttpRequests
app.post('/', function (req, res) {
  if (req.body.message == "file_uploaded") {
    //String manipulation to get usable path
    var path = __dirname + "\\static\\modules";
    var pathParts = path.split("\\");
    var pathFinal = "";
    for (var i = 0; i < pathParts.length; i++) {
      pathFinal += pathParts[i] + "/";
    }
    //Get directories which exist
    getSubDirectoriesOrFiles(pathFinal, function (dirs) {
      //For each dir in dirs i need to check if a category in the mongodb exists that does not exist in this list.
      getSetOfScriptCategories(function (err, result) {
        if (err != null) { console.log(err) }
        else {
          //remove all dirs that already exist in the solution
          for (var i = 0; i < result.length; i++) {
            if (dirs.indexOf(result[i]) != -1) {
              result.splice(i, 1);
              i--;
            }
          }
          //create the missing dirs
          var missingDirs = result;
          createMissingDirs(pathFinal, missingDirs);
          //once the missing dirs are created we need to get the set of categories again as those are the names of the dirs
          getSetOfScriptCategories(function (err, result) {
            //in this callback we then get the files of each sub dir and compare it to whats in mongo
            for (var i = 0; i < result.length; i++) {
              getFilesForSubdirectory(pathFinal + result[i], function (files, path) {
                var currentPathSplit = path.split("/");
                var currentPath = currentPathSplit[currentPathSplit.length - 1];
                getFilesForCategory(currentPath, function (err, result) {
                  if (err != null) { console.log("error occured") }
                  else {
                    for (var i = 0; i < result.length; i++) {
                      if (files.indexOf(result[i]) != -1) {
                        result.splice(i, 1);
                        i--;
                      }
                    }
                    //create missing files
                    for (var j = 0; j < result.length; j++) {
                      createMissingFiles(path, result[j]);
                    }
                    createNewGameFile();
                  }
                })
              })
            }
          })
        }
      })
    });
    console.log(req.body.message);
    res.send(res.header);
  }

  if (req.body.message == "new_player") {
    username = req.body.email;
    gameName = req.body.gameName;
    res.send(res.header);
  }
});

function getRootPath() {
  var path = __dirname;
  var pathParts = path.split("\\");
  var pathFinal = "";
  for (var i = 0; i < pathParts.length; i++) {
    pathFinal += pathParts[i] + "/";
  }
  return pathFinal;
}


function createNewGameFile(){
  writeCreateObjectsAndImportMethod(function(err,result){
    if(err != null) {return err}
    else{
      fs.writeFile(getRootPath() + "static/game.js",result,function(err,data){
        if(err){}
        else{
        }
      })
    }
  })
}

function writeCreateObjectsAndImportMethod(callback) {
  mongoDbActions.getAllScriptObjects(MongoClient, dbPath, function (err, result) {
    if (err != null) { callback("error occured while getting db", null) }
    else {
      var functionString = "";
      functionString += "function createObjects(list) { \nlist.forEach(object => { \n for(var i = 0; i < object.length; i++){ \n ";
      var currentExistingIfEntry = []
      for (var i = 0; i < result.length; i++) {
        if (currentExistingIfEntry.indexOf(result[i].Category +
          result[i].ComponentName.split(".")[0].charAt(0).toUpperCase() +
          result[i].ComponentName.split(".")[0].slice(1)) == -1) {
          if (i == 0) {
            functionString += "if(";
          } else {
            functionString += "else if("
          }
          functionString += "object[i].object == " + '"' + result[i].Category.toLowerCase() +
            result[i].ComponentName.split(".")[0].charAt(0).toLowerCase() +
            result[i].ComponentName.split(".")[0].slice(1) + '"' +
            "){ \n";
          functionString += "canvasObjects[i] = new " + result[i].Category.toLowerCase() +
            result[i].ComponentName.split(".")[0].charAt(0).toLowerCase() +
            result[i].ComponentName.split(".")[0].slice(1);
          var parameters = result[i].ComponentContent.split("constructor")[1].split(")")[0].substring(1).split(",");
          functionString += "(";
          for (var j = 0; j < parameters.length; j++) {
            if (parameters[j].charAt(0) == " ") {
              parameters[j] = parameters[j].substring(1);
            }
            if (j != parameters.length - 1) {
              functionString += "object[i]." + parameters[j] + ",";
            } else {
              functionString += "object[i]." + parameters[j];
            }
          }
          functionString += "); \n}";

          currentExistingIfEntry.push(result[i].Category +
            result[i].ComponentName.split(".")[0].charAt(0).toUpperCase() +
            result[i].ComponentName.split(".")[0].slice(1))
        }

      }
      functionString += "\ncanvasObjects[i].setDefaultForUninstantiatedParameters(canvas);}\n }); + \n";
      functionString += "for(var i = 0; i < canvasObjects.length; i++){canvasObjects[i].init(canvasObjects);}"
      functionString += "\ncanvasUpdated()\n}";

      var importString = "";
      var currentExistingImport = [];
      for (var j = 0; j < result.length; j++) {
        if (currentExistingImport.indexOf(result[j].Category +
          result[j].ComponentName.split(".")[0].charAt(0).toUpperCase() +
          result[j].ComponentName.split(".")[0].slice(1)) == -1) {
          importString += "import " + result[j].Category.toLowerCase() +
            result[j].ComponentName.split(".")[0].charAt(0).toLowerCase() +
            result[j].ComponentName.split(".")[0].slice(1) + " from '../static/modules/" +
            result[j].Category + "/" + result[j].ComponentName + "';\n";
          currentExistingImport.push(result[j].Category +
            result[j].ComponentName.split(".")[0].charAt(0).toLowerCase() +
            result[j].ComponentName.split(".")[0].slice(1))
        }

      }
      
      var fileToAppend = readStaticCodeFile(function(err,result){
        if(err != null){callback(err)}
        else{
          var staticString = result;
          var dynamicFileString = staticString + "\n\n" + functionString + "\n" + importString;
          callback(null, dynamicFileString);
        }
      })
    }
  });
}


function readStaticCodeFile(callback) {
  var filePath = getRootPath() + "static/codeGenFiles/staticGame.js";
  fs.readFile(filePath, function (err, data) {
    if (err) callback(err, null);
    var fileContents = data.toString();
    callback(null, fileContents)
  });
}

function getFilesForSubdirectory(path, callback) {
  fs.readdir(path, function (err, dirContent) {
    return callback(dirContent, path);
  })
}

function getSubDirectoriesOrFiles(path, callback) {
  fs.readdir(path, function (err, dirContent) {
    var directories = [];
    dirContent.forEach(contentObject => {
      directories.push(contentObject);
    });
    return callback(directories);
  })
}


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

var canvasObjects = {}

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

function getFilesForCategory(currentPath, callback) {
  mongoDbActions.getAllScriptObjects(MongoClient, dbPath, function (err, result) {
    if (err != null) { callback("error in getFilesForCategory", null); }
    else {
      var arrayOfFiles = [];
      for (var i = 0; i < result.length; i++) {
        if (currentPath == result[i].Category) {
          arrayOfFiles.push(result[i].ComponentName);
        }
      }
      callback(null, arrayOfFiles);
    }
  })
}

function createMissingDirs(path, dirs, callback) {
  for (var i = 0; i < dirs.length; i++) {
    if (!fs.existsSync(path + "/" + dirs[i])) {
      fs.mkdirSync(path + "/" + dirs[i]);
    }
  }
}

function createMissingFiles(path, filename) {
  if (!fs.existsSync(path + "/" + filename)) {
    getFileContent(filename, function (err, result, name) {
      if (err != null) { console.log("error in getFileCallback"); }
      else {
        fs.writeFile(path + "/" + name, result, function (err, data) { if (err) throw err; });
      }

    })
  }
}


//Code for emptying mongo scripts, testing code.
/*function clearScriptsInMongo(){
  mongoDbActions.deleteScripts(MongoClient, dbPath);
}
clearScriptsInMongo();
*/

function getFileContent(name, callback) {
  mongoDbActions.getAllScriptObjects(MongoClient, dbPath, function (err, result) {
    if (err != null) { callback("error getting file content", null) }
    else {
      for (var i = 0; i < result.length; i++) {
        if (result[i].ComponentName == name) {
          callback(null, result[i].ComponentContent, name)
        }
      }
    }
  })
}

function getGames(callback) {
  mongoDbActions.findAllGames(MongoClient, dbPath, function (err, result) {
    if (err != null) { callback(err, null) }
    else {
      callback(null, result)
    }
  })
}

function getSetOfScriptCategories(callback) {
  mongoDbActions.getAllScriptObjects(MongoClient, dbPath, function (err, result) {
    if (err != null) { callback(err, null) }
    else {
      var categoriesSet = [];
      for (var i = 0; i < result.length; i++) {
        if (categoriesSet.indexOf(result[i].Category) == -1) {
          categoriesSet.push(result[i].Category);
        }
      }
      callback(null, categoriesSet);
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
      for (var i = 0; i < result.length; i++) {
        if (result[i].game == game) {
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
    //code which avoids using the asp.net core server to test new components
    else{
      players[socket.id] = {
        
      };
      var testCanvasObjects = {"list":{"Components":'[{"id": 0, "bounds": [{"x":400,"y":400},{"x":700, "y":400}, {"x": 700, "y":700}, {"x":400,"y":700}],"moveAble":true, "targetAble": true, "color": "white", "text":"quite likely not working", "textVisible": false, "object":"memorymemoryCard", "size":0.4},{"id": 1, "bounds": [{"x":0,"y":400},{"x":300, "y":400}, {"x": 300, "y":700}, {"x":0,"y":700}],"moveAble":true, "targetAble": true, "color": "white", "text":"quite likely not working", "textVisible": false, "object":"memorymemoryCard","size":0.4}]', "Name":"memoryGame"}};
      socket.emit('initObjects',testCanvasObjects)
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