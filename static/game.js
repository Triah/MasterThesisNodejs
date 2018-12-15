var socket = io();
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

socket.on('message', function(data) {
  console.log(data);
});

var canvasObjects = {};

var draggable = false;

socket.emit('new player');

function draw(obj){
  
}

socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);
  squareShape(context, 10,10,50,50,true);
  squareShape(context, 70,10,50,50,false);
});