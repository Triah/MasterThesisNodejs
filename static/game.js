
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



const square = new Rectangle(10,10,100,100);

function addRect(type,x,y,w,h){
  var rect = new Rectangle(x,y,w,h);
  rect.type = type;
  canvasObjects.push(rect);
}

/*This needs to be done more clean*/
addRect("strokeRect", square._x, square._y, square._w, square._h);
addRect("fillRect", 120, 10, 100, 100);
canvasUpdated();

console.log(canvasObjects[1]);

//socket.emit('canvasObjects', canvasObjects);

function draw(){
  if(canvasUpToDate == false){
    context.beginPath();
    for(var i=0; i < canvasObjects.length; i++){
      var obj = canvasObjects[i];
      
      if(obj.type == "strokeRect"){

        context.strokeRect(obj._x,obj._y,obj._w,obj._h);
      } 
      
      else if(obj.type == "fillRect"){
        obj.setFill("#FF0000");
        context.fillStyle = obj._fill;
        context.fillRect(obj._x,obj._y,obj._w,obj._h);
        context.fillStyle = "white";
        context.textAlign ="center";
        context.fillText("Testing text", obj._x +obj._w/2, obj._y + obj._h/2);
      }
      
      console.log(canvasObjects);
    }
    canvasUpToDate = true;
  }
  
}

socket.on('state', function(players) {
  draw();
});