var dbName = "MasterThesisMongoDb";

exports.addUserToGameRoom = function (client, path, roomname, user, currentUsers) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        //add the new user to the room
        currentUsers.push(user);
        //find the rooms so we can match on room name
        dbContent.collection("GameRooms").find({}).toArray(function (err, result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].roomname == roomname) {
                    //once a match is found we update the list of users in the room
                    dbContent.collection("GameRooms").update({ _id: result[i]._id }, { $set: { users: currentUsers } }, function (err, result) {
                        if (err) throw err;
                        console.log("user added");
                        db.close();
                    })
                }
            }
        })
    })
}

exports.getUsersInRoom = function (client, path, users, game, callback) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("GameRooms").find({}, { projection: { roomname: 1, users: 2, game: 3, capacity: 4 } }).toArray(function (err, result) {
            var roomUsersObject = [];
            for (var i = 0; i < result.length; i++) {
                if (result[i].game == game) {
                    users = [];
                    result[i].users.forEach(user => {
                        users.push(user);
                    });
                    roomUsersObject.push({ roomname: result[i].roomname, game: result[i].game, users: users, capacity: result[i].capacity });
                }
            }
            if (roomUsersObject[0] != undefined) {
                callback(null, roomUsersObject);
                return;
            }
            callback("no rooms with that name were found", null);
        })
    })
}

exports.addGameRoom = function (client, path, game, roomname, capacity, users, callback) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        var newObject = {
            roomname: roomname,
            game: game,
            capacity: capacity,
            users: users
        }
        dbContent.collection("GameRooms").insertOne({
            roomname: roomname,
            game: game,
            capacity: capacity,
            users: users
        })
        if(newObject != null){
            callback(null,newObject);
        } else {
            callback("error adding room", null);
        }
    })
}

exports.getCurrentRoomsForGame = function (client, path, game, callback) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("GameRooms").find({}).toArray(function (err, result) {
            if (err) throw err;
            var rooms = [];
            for (var i = 0; i < result.length; i++) {
                if (result[i].game == game) {
                    rooms.push(result[i]);
                }
            }
            if (rooms[0] != undefined) {
                callback(null, rooms);
            } else {
                callback("No rooms were found", null);
            }
        })
    })
}


exports.findAllGames = function (client, path,callback) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("Games").find({}).toArray(function (err, result) {
            if (err) callback(err,null);
            callback(null,result);
            db.close();
        })
    })
}

exports.getComponentsForGame = function (client, path, name, callback) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("Games").find({}, { projection: { Name: 1, Components: 2 } }).toArray(function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                if (result[i].Name == name) {
                    callback(null, result)
                    return;
                }
            }
            callback("no such entry", null);
        })
    })
}

//Deletion method, shouldnt be used lightly
exports.deleteGameRoomsEntry = function (client, path) {
    client.connect(path, function (err, db) {
        var dbContent = db.db(dbName);
        //var myquery = { GameId: 2 };
        dbContent.collection("GameRooms").drop(function (err, obj) {
            if (err) throw err;
            db.close();
        });
    });
}

//USER ACTIONS
exports.insertOneUser = function (client, path, id, username) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("Users").insertOne({
            _id: id,
            _username: username
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                db.close();
            }
        });
    });
};


exports.findAllUsers = function (client, path) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("Users").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });
};


/*
* This part of the code is responsible for handling the scripts needed for the modularity
* this will include both the game.js and the components.
*/

exports.getAllScriptObjects = function(client, path, callback){
    client.connect(path, function(err, db){
        if(err) callback(err,null);
        var dbContent = db.db(dbName);
        dbContent.collection("Scripts").find({}).toArray(function(err, result){
            if(err) callback(err,null);
            else {
                callback(null, result);
                db.close();
            }
        })
    })
}