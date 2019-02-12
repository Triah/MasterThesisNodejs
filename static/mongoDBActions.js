var dbName = "MasterThesisMongoDb";

//ROOM ACTIONS
//capacity should be an int
//users is a list of user objects
exports.createRoom = function (client, path, roomname, capacity, users) {
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
};



exports.findAllGames = function (client, path) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("Games").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        })
    })
}

exports.getComponentsForGame = function (client, path, name) {
    client.connect(path, function (err, db) {
        if (err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("Games").find({}, { projection: { Name: 1, Components: 2 } }).toArray(function (err, result) {
            if (err) throw err;
            //var JsonBounds = null;
            //var gameObjects = [];
            for (var i = 0; i < result.length; i++) {
                if (result[i].Name == name) {
                    return result;
                    //       JsonBounds = JSON.parse(result[i].Components);
                }
            }
            /*for(var i = 0; i < JsonBounds.objects.length; i++){
                gameObjects[i] = {id: JsonBounds.objects[i].id, bounds: JsonBounds.objects[i].bounds, moveAble:JsonBounds.objects[i].moveAble,collideAble:JsonBounds.objects[i].collideAble, targetAble:JsonBounds.objects[i].targetAble};
            }
            console.log(gameObjects[0]);
            return gameObjects;
        */})
    })
}

/*exports.deleteGameEntry = function (client, path) {
    client.connect(path, function (err, db) {
        var dbContent = db.db(dbName);
        var myquery = { GameId: 2 };
        dbContent.collection("Games").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
}*/


//in this method, gameroom is the name of the room
//user is a string representing the username
//To use this method properly a recursive algorithm is probably optimal
exports.addUserToRoom = function (client, path, gameroom, user) {
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
