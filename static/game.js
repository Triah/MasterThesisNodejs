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


/*This needs to be done more clean*/
addRect(canvasObjects, 10, 10, 100, 100);
canvasUpdated();


//socket.emit('canvasObjects', canvasObjects);

function draw(){
  if(canvasUpToDate == false){
    context.beginPath();
    for(var i=0; i < canvasObjects.length; i++){
      var obj = canvasObjects[i];
      context.strokeRect(obj.x,obj.y,obj.w,obj.h);
    }
    canvasUpToDate = true;
  }
  
}

socket.on('state', function(players) {
  draw();
});