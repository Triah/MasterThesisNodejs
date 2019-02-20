var dbName = "MasterThesisMongoDb";

//ROOM ACTIONS
//capacity should be an int
//users is a list of user objects
//for hvert spil, find spil med spil navn
/*exports.createRoom = function (client, path, roomname, capacity, users) {
    var roomexists = false;
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("GameRooms").find({}, { projection: { _id: 1 } }).toArray(function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                if (result[i]._id == roomname) {
                    roomexists = true;
                    db.close();
                }
            }
            if (!roomexists) {
                dbContent.collection("GameRooms").insertOne({
                    _id: roomname,
                    capacity: capacity,
                    usersOfRoom: users
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        db.close();
                    }
                });
            }
        });
    });
};*/

exports.addUserToGameRoom = function(client, path, roomname, user, currentUsers){
    client.connect(path, function(err,db){
        if(err) throw err;
        var dbContent = db.db(dbName);
        //add the new user to the room
        currentUsers.push(user);
        //find the rooms so we can match on room name
        dbContent.collection("GameRooms").find({}).toArray(function(err, result){
            for(var i = 0; i < result.length; i++){
                if(result[i].roomname == roomname){
                    //once a match is found we update the list of users in the room
                    dbContent.collection("GameRooms").update({_id:result[i]._id}, {$set: {users:currentUsers}}, function(err, result){
                        if(err) throw err;
                        db.close();
                    })
                }
            }
        })
    })
}

exports.getUsersInRoom = function(client,path,roomname,users, callback){
    client.connect(path, function(err,db){
        if(err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("GameRooms").find({}, {projection: {roomname: 1, users: 2}}).toArray(function(err,result){
            for(var i = 0; i < result.length; i++){
                if(result[i].users != undefined){
                    if(result[i].roomname == roomname){
                        result[i].users.forEach(user => {
                            users.push(user);
                        });
                        callback(null, users);
                        return;
                    } 
                }
            }
            callback("no rooms with that name were found", null);
        })
    })
}

exports.addGameRoom = function(client,path,game,roomname,capacity,users){
    client.connect(path, function(err,db){
        if(err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("GameRooms").insertOne({
            roomname: roomname,
            game: game,
            capacity: capacity,
            users: users
        })
    })
}

exports.getCurrentRoomsForGame = function(client, path, game, callback){
    client.connect(path, function(err,db){
        if(err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("GameRooms").find({}).toArray(function(err,result){
            if(err) throw err;
            var rooms = [];
            for(var i = 0; i < result.length; i++){
                if(result[i].game = game){
                    rooms.push(result[i]);
                }
            }
            if(rooms[0] != undefined){
                callback(null, rooms);
            } else {
                callback("No rooms were found",null);
            }
        })
    })
}


exports.findAllGames = function (client, path) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("Games").find({}).toArray(function (err, result) {
            if (err) throw err;
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
                    callback(null,result)
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

//in this method, gameroom is the name of the room
//user is a string representing the username
//To use this method properly a recursive algorithm is probably optimal

//LEGACY CODE
/*exports.addUserToRoom = function (client, path, gameroom, user) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        var query = { _id: gameroom };
        var updatevalue = { $set: { usersOfRoom: user } };
        dbContent.collection("GameRooms").updateOne(query, updatevalue, function (err, res) {
            if (err) throw err;
            console.log(gameroom + " was updated with a new user: " + user);
            db.close();
        })
    })
}*/

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
