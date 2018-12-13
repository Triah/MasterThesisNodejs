function squareShape(context, x, y, w, h, fill){
    context.beginPath();
    if(!fill){
        context.strokeRect(x,y,w,h);
    }
    if(fill){
        context.fillRect(x,y,w,h)
    }
}