
var socket = io();
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
var canvasUpToDate;

function canvasUpdated(){
  context.clearRect(0,0,800,600);
  canvasUpToDate = false;
}

var canvasObjects = [];

var draggable = false;

socket.emit('new player');

/*
socket on get json object that defines what should be on the canvas
*/
function createObjects(list){
  for(let i in list){
    if(list[i].type == "Rectangle") {
      canvasObjects[i] = new Rectangle(list[i].id,list[i].x, list[i].y, list[i].w, list[i].h);
    } else if(list[i].type == "FilledRectangle"){
      canvasObjects[i] = new FilledRectangle(list[i].id,list[i].x, list[i].y, list[i].w, list[i].h, list[i].fill, list[i].text, list[i].textColor);
    } else if(list[i].type == "Circle"){
      canvasObjects[i] = new Circle(list[i].id,list[i].x,list[i].y,list[i].r);
    }
  }
}

socket.on("initObjects", function(objectList){
  createObjects(objectList);
});



/*This needs to be done more clean*/
canvasUpdated();

//socket.emit('canvasObjects', canvasObjects);

//drag and drop stuff
var lockedItem = null;
var itemIsLocked = false;
var DragOffset = { x: 0, y:0 };
canvas.onmousedown = function(e){
  //make sure only one item is picked
  for(var i = 0; i < canvasObjects.length; i++){
    if(!itemIsLocked && canvasObjects[i].getCollisionArea(e)){
      itemIsLocked = true;
      lockedItem = canvasObjects[i];
    } 
  }
}

canvas.onmousemove = function(e){
  if(itemIsLocked && lockedItem != null){
    lockedItem.move(e);
    context.clearRect(0,0,canvas.width,canvas.height);
    for(var i = 0; i<canvasObjects.length;i++){
      canvasObjects[i].draw(context);
    }
  }
}

canvas.onmouseup = function(e){
  //unlock item
  if(lockedItem != null){
    socket.emit('updateItemPosition', lockedItem);
    itemIsLocked = false;
    lockedItem = null;
  }
  
}

socket.on('updateItemPositionDone', function(lockedItem){
  console.log("hej");
  canvasObjects[lockedItem.id].x = lockedItem.x;
  canvasObjects[lockedItem.id].y = lockedItem.y;
  context.clearRect(0,0,canvas.width,canvas.height);
  for(var i = 0; i<canvasObjects.length;i++){
    canvasObjects[i].draw(context);
  }
});

function draw(){
  if(canvasUpToDate == false){
    context.beginPath();
    
    for(var i=0; i < canvasObjects.length; i++){
      var obj = canvasObjects[i];
      obj.draw(context);
    }
    
    canvasUpToDate = true;
  }
  
}

socket.on('state', function(players) {
  draw();
});