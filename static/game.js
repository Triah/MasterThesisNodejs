'use strict';

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

var canvasObjects = [];
let canvasGrid = new Grid(20, 20);
var draggable = false;

socket.emit('new player');

socket.on('new player in room', function (user, room) {
  //add user to list based on room
});


function createJSONfromInitObjects(objectList){
    var listOfObjects = [];
      for(var i in objectList){
        listOfObjects.push(eval('(' + objectList[i].Components + ')'));
      }
      return listOfObjects;
  }
  
  
  socket.on("initObjects", function (objectList) {
    console.log(socket);
    var objectsToBeCreated = createJSONfromInitObjects(objectList);
    createObjects(objectsToBeCreated);
    canvasGrid.display(canvas, context);
  });
  
  canvasUpdated();
  
  //drag and drop stuff
  var lockedItem = null;
  var itemIsLocked = false;

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
  
      //Work in progress not really a priority atm but will need to move this to a modular place (within the objects themselves)
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
  

function createObjects(list) { 
for (let i in list) { 
if(list[i].object == "abstractCollisionShape"){ 
canvasObjects[i] = new abstractCollisionShape(list[i].id,list[i].bounds,list[i].moveAble,list[i].collideAble,list[i].targetAble); 
}else if(list[i].object == "abstractShape"){ 
canvasObjects[i] = new abstractShape(list[i].id,list[i].bounds,list[i].moveAble,list[i].collideAble,list[i].targetAble); 
}else if(list[i].object == "shapesSquare"){ 
canvasObjects[i] = new shapesSquare(list[i].id,list[i].bounds,list[i].moveAble,list[i].collideAble,list[i].targetAble); 
}else if(list[i].object == "testSquare"){ 
canvasObjects[i] = new testSquare(list[i].id,list[i].bounds,list[i].moveAble,list[i].collideAble,list[i].targetAble); 
}else if(list[i].object == "testsSquare"){ 
canvasObjects[i] = new testsSquare(list[i].id,list[i].bounds,list[i].moveAble,list[i].collideAble,list[i].targetAble); 
}else if(list[i].object == "testShape"){ 
canvasObjects[i] = new testShape(list[i].id,list[i].bounds,list[i].moveAble,list[i].collideAble,list[i].targetAble); 
}else if(list[i].object == "testsCollisionShape"){ 
canvasObjects[i] = new testsCollisionShape(list[i].id,list[i].bounds,list[i].moveAble,list[i].collideAble,list[i].targetAble); 
}else if(list[i].object == "dwadwaShape"){ 
canvasObjects[i] = new dwadwaShape(list[i].id,list[i].bounds,list[i].moveAble,list[i].collideAble,list[i].targetAble); 
}
}
canvasUpdated()
}
import abstractCollisionShape from '../static/modules/abstract/collisionShape.js';
import abstractShape from '../static/modules/abstract/shape.js';
import shapesSquare from '../static/modules/shapes/Square.js';
import testSquare from '../static/modules/test/Square.js';
import testsSquare from '../static/modules/tests/Square.js';
import testShape from '../static/modules/test/shape.js';
import testsCollisionShape from '../static/modules/tests/collisionShape.js';
import dwadwaShape from '../static/modules/dwadwa/shape.js';
