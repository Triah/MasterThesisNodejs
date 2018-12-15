var dbName = "MasterThesisMongoDb";

//ROOM ACTIONS
exports.createRoom = function(client, path, roomname){
    var roomexists = false;
    client.connect(path, function(err, db){
        if(err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("GameRooms").find({}, {projection: {_id: 1}}).toArray(function(err,result){
            if(err) throw err;
            for(var i = 0; i < result.length; i++){
                if(result[i]._id == roomname){
                    roomexists = true;
                    db.close();
                }
            }
            if(!roomexists){
                dbContent.collection("GameRooms").insertOne({
                    _id: roomname
                    }, (err, result) => {
                    if(err){
                        console.log(err);
                    } else {
                        db.close();
                    }
                });
            }
        });
    });
};

exports.findAllRooms = function(client, path){
    client.connect(path, function(err, db){
        if(err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("GameRooms").find({}).toArray(function(err, result){
            if(err) throw err;
            console.log(result);
            db.close();
        })
    })
}



//USER ACTIONS
exports.insertOneUser = function(client, path, id, username){
    client.connect(path, function(err, db){
        if(err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("Users").insertOne({
        _id: id,
        _username: username      
        }, (err, result) => {
        if(err){
            console.log(err);
        } else {
            db.close();
        }
        });
  });
};
exports.findAllUsers = function(client, path){
    client.connect(path, function(err,db){
        if(err) throw err;
        var dbContent = db.db(dbName);
        dbContent.collection("Users").find({}).toArray(function(err, result){
            if(err) throw err;
            console.log(result);
            db.close();
        });
    });
};
  