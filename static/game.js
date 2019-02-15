'use strict';

import Shape from '../static/modules/abstract/shape.js';
import CollisionShape from '../static/modules/abstract/collisionShape.js';



var socket = io();
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
var canvasUpToDate;

function canvasUpdated() {
  context.clearRect(0, 0, 800, 600);
  canvasUpToDate = false;
}


//module stuff


var canvasObjects = [];
let canvasGrid = new Grid(20, 20);
var draggable = false;

socket.emit('new player');

socket.on('new player in room', function (user, room) {
  //add user to list based on room
});

/*
socket on get json object that defines what should be on the canvas
*/
//Grid
//Objects
function createObjects(list) {
  for (let i in list) {
    if (!list[i].collideAble) {
      canvasObjects[i] = new Shape(list[i].id, list[i].bounds, list[i].moveAble, list[i].collideAble, list[i].targetAble);
    } else if (list[i].collideAble) {
      canvasObjects[i] = new CollisionShape(list[i].id, list[i].bounds, list[i].moveAble, list[i].collideAble, list[i].targetAble);
    }
  }
}


socket.on("initObjects", function (objectList) {
  console.log(objectList[0]);
  //the entire thing comes out as a string, i can make a string manipulation function fixing it probably
  
  
  createObjects(objectList);
  //console.log(canvasObjects)
  canvasGrid.display(canvas, context);
});



/*This needs to be done more clean*/
canvasUpdated();

//socket.emit('canvasObjects', canvasObjects);

//drag and drop stuff
var lockedItem = null;
var itemIsLocked = false;
var DragOffset = { x: 0, y: 0 };
canvas.onmousedown = function (e) {
  //make sure only one item is picked
  for (var i = 0; i < canvasObjects.length; i++) {
    if (!itemIsLocked && canvasObjects[i].getCollisionArea(e)) {
      itemIsLocked = true;
      lockedItem = canvasObjects[i];
    }
  }
}

canvas.onmousemove = function (e) {
  if (itemIsLocked && lockedItem != null) {
    if (lockedItem.moveAble) {
      lockedItem.move(canvas, e);
    }

    //Work in progress
    if (lockedItem.collideAble == true) {
      if (lockedItem.isCollidingWithOtherObject(canvasObjects) != null) {
        var collisionObject = lockedItem.isCollidingWithOtherObject(canvasObjects);
        for (var vector in lockedItem.getVectors()) {
          if (collisionObject.firstObj == lockedItem) {
            var collisionPointX = collisionObject.secondObj.getBounds()[collisionObject.cornerForCollision].x;
            var collisionPointY = collisionObject.secondObj.getBounds()[collisionObject.cornerForCollision].y;
            var firstVectorX = collisionObject.firstObj.getVectors()[vector].x1;
            var firstVectorY = collisionObject.firstObj.getVectors()[vector].y1;
            var secondVectorX = collisionObject.firstObj.getVectors()[vector].x2;
            var secondVectorY = collisionObject.firstObj.getVectors()[vector].y2;

            //console.log(Math.sqrt(Math.pow(collisionPointX-firstVectorX,2)+Math.pow(collisionPointY - firstVectorY,2))+Math.sqrt(Math.pow(collisionPointX-secondVectorX,2)+Math.pow(collisionPointY - secondVectorY,2)));

            if ((Math.floor(Math.sqrt(Math.pow(collisionPointX - firstVectorX, 2) + Math.pow(collisionPointY - firstVectorY, 2)) +
              Math.sqrt(Math.pow(collisionPointX - secondVectorX, 2) + Math.pow(collisionPointY - secondVectorY, 2)))) -
              Math.floor(Math.sqrt(Math.pow(firstVectorX - secondVectorX, 2) + Math.pow(firstVectorY - secondVectorY, 2))) < 10) {
              console.log(collisionObject.firstObj.getVectors()[vector]);
            }



          } else if (collisionObject.firstObj != lockedItem) {
            try {
              var collisionPointX = collisionObject.secondObj.getBounds()[collisionObject.cornerForCollision].x;
              var collisionPointY = collisionObject.secondObj.getBounds()[collisionObject.cornerForCollision].y;
              var firstVectorX = collisionObject.firstObj.getVectors()[vector].x1;
              var firstVectorY = collisionObject.firstObj.getVectors()[vector].y1;
              var secondVectorX = collisionObject.firstObj.getVectors()[vector].x2;
              var secondVectorY = collisionObject.firstObj.getVectors()[vector].y2;

              if ((Math.floor(Math.sqrt(Math.pow(collisionPointX - firstVectorX, 2) + Math.pow(collisionPointY - firstVectorY, 2)) +
                Math.sqrt(Math.pow(collisionPointX - secondVectorX, 2) + Math.pow(collisionPointY - secondVectorY, 2)))) -
                Math.floor(Math.sqrt(Math.pow(firstVectorX - secondVectorX, 2) + Math.pow(firstVectorY - secondVectorY, 2))) < 10) {
                console.log(collisionPointX - firstVectorX)
                console.log(collisionObject.firstObj.getVectors()[vector]);
              }
            } catch (TypeError) {
              console.log("Due to insufficient vectors an error was caught");
            }

          }
        }
      }
    }


    context.clearRect(0, 0, canvas.width, canvas.height);
    canvasGrid.display(canvas, context);
    for (var i = 0; i < canvasObjects.length; i++) {
      canvasObjects[i].draw(context);
    }
  }
}

canvas.onmouseup = function (e) {
  //unlock item
  if (lockedItem != null) {
    socket.emit('updateItemPosition', lockedItem);
    itemIsLocked = false;
    lockedItem = null;
  }

}

socket.on('updateItemPositionDone', function (lockedItem) {
  for (var updateDone in lockedItem) {
    canvasObjects[lockedItem.id][updateDone] = lockedItem[updateDone];
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvasGrid.display(canvas, context);
  for (var i = 0; i < canvasObjects.length; i++) {
    canvasObjects[i].draw(context);
  }
});

function draw() {
  if (canvasUpToDate == false) {
    context.beginPath();

    for (var i = 0; i < canvasObjects.length; i++) {
      var obj = canvasObjects[i];
      obj.draw(context);
    }

    canvasUpToDate = true;
  }

}

socket.on('state', function (players) {
  draw();
});