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


function createJSONfromInitObjects(objectList) {
  var listOfObjects = [];
  console.log(objectList);
  for (var i in objectList) {
    listOfObjects.push(eval('(' + objectList[i].Components + ')'));
  }
  console.log(listOfObjects);
  return listOfObjects;
}


socket.on("initObjects", function (objectList) {
  var objectsToBeCreated = createJSONfromInitObjects(objectList);
  createObjects(objectsToBeCreated);
  canvasGrid.display(canvas, context);
});

canvasUpdated();

//drag and drop stuff
var lockedItem = null;
var itemIsLocked = false;
var DragOffset = { x: 0, y: 0 };
canvas.onmousedown = function (e) {
  //make sure only one item is picked
  for (var i = 0; i < canvasObjects.length; i++) {
    canvasObjects[i].process(e);
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
  console.log(list);
  list.forEach(object => {
    console.log(object);
    for (var i = 0; i < object.length; i++) {
      if (object[i].object == "abstractcollisionShape") {
        canvasObjects[i] = new abstractcollisionShape(object[i].id, object[i].bounds, object[i].moveAble, object[i].collideAble, object[i].targetAble);
      } else if (object[i].object == "abstractshape") {
        canvasObjects[i] = new abstractshape(object[i].id, object[i].bounds, object[i].moveAble, object[i].collideAble, object[i].targetAble);
      } else if (object[i].object == "shapessquare") {
        canvasObjects[i] = new shapessquare(object[i].id, object[i].bounds, object[i].moveAble, object[i].collideAble, object[i].targetAble);
      } else if (object[i].object == "testssquare") {
        canvasObjects[i] = new testssquare(object[i].id, object[i].bounds, object[i].moveAble, object[i].collideAble, object[i].targetAble);
      } else if (object[i].object == "testsquare") {
        canvasObjects[i] = new testsquare(object[i].id, object[i].bounds, object[i].moveAble, object[i].collideAble, object[i].targetAble);
      } else if (object[i].object == "testcategorysquare") {
        canvasObjects[i] = new testcategorysquare(object[i].id, object[i].bounds, object[i].moveAble, object[i].collideAble, object[i].targetAble);
      } else if (object[i].object == "dwadwasquare") {
        canvasObjects[i] = new dwadwasquare(object[i].id, object[i].bounds, object[i].moveAble, object[i].collideAble, object[i].targetAble);
      } else if (object[i].object == "dwadwacollisionShape") {
        canvasObjects[i] = new dwadwacollisionShape(object[i].id, object[i].bounds, object[i].moveAble, object[i].collideAble, object[i].targetAble);
      } else if (object[i].object == "testscollisionShape") {
        canvasObjects[i] = new testscollisionShape(object[i].id, object[i].bounds, object[i].moveAble, object[i].collideAble, object[i].targetAble);
      } else if (object[i].object == "abstractsquare") {
        canvasObjects[i] = new abstractsquare(object[i].id, object[i].bounds, object[i].moveAble, object[i].collideAble, object[i].targetAble);
      } else if (object[i].object == "memorymemorycard") {
        canvasObjects[i] = new memorymemorycard(object[i].id, object[i].bounds, object[i].moveAble, object[i].targetAble);
      } 
    }
  });
  canvasUpdated()
}
import abstractcollisionShape from '../static/modules/abstract/collisionShape.js';
import abstractshape from '../static/modules/abstract/shape.js';
import shapessquare from '../static/modules/shapes/Square.js';
import testssquare from '../static/modules/tests/Square.js';
import testsquare from '../static/modules/test/Square.js';
import testcategorysquare from '../static/modules/testcategory/Square.js';
import dwadwasquare from '../static/modules/dwadwa/Square.js';
import dwadwacollisionShape from '../static/modules/dwadwa/collisionShape.js';
import testscollisionShape from '../static/modules/tests/collisionShape.js';
import abstractsquare from '../static/modules/abstract/Square.js';
import memorymemorycard from '../static/modules/memory/memoryCard.js';
