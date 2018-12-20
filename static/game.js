
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



const rect = new Rectangle(10,10,100,100);
const circle = new Circle(60,170,50);
const filledRect = new FilledRectangle(120,10,100,100,"blue","test", "white");

canvasObjects.push(rect);
canvasObjects.push(circle);
canvasObjects.push(filledRect);



/*This needs to be done more clean*/
canvasUpdated();

console.log(canvasObjects[1]);

//socket.emit('canvasObjects', canvasObjects);

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