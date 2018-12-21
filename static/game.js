
var socket = io();
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
var canvasUpToDate;


socket.on('message', function(data) {
  console.log(data);
});

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

const rect = new Rectangle(500,10,100,100);
const circle = new Circle(60,170,50);
const filledRect = new FilledRectangle(120,10,100,100,"blue","test", "white");

canvasObjects.push(rect);
canvasObjects.push(circle);
canvasObjects.push(filledRect);



/*This needs to be done more clean*/
canvasUpdated();

//socket.emit('canvasObjects', canvasObjects);

canvas.onmousedown = function(e){
  //make sure only one item is picked
  var itemIsLocked = false;
  for(var i = 0; i < canvasObjects.length; i++){
    if(!itemIsLocked && 
      e.x+10 < canvasObjects[i].x + canvasObjects[i].w +20 && 
      e.x+10 > canvasObjects[i].x && 
      e.y - 10 > canvasObjects[i].y &&
      e.y - 10 < canvasObjects[i].y + canvasObjects[i].h){
      itemIsLocked = true;
      //set this to variables to get the offset values and use these in another function
      canvasObjects[i].x = e.x - 10 - canvasObjects[i].w/2;
      canvasObjects[i].y = e.y - 10 - canvasObjects[i].h/2
      canvasUpdated();
    }
  }
  //unlock item
  itemIsLocked = false;
}

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