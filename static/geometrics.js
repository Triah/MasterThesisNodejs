function squareShape(context, x, y, w, h, fill){
    context.beginPath();
    if(!fill){
        context.strokeRect(x,y,w,h);
    }
    if(fill){
        context.fillRect(x,y,w,h)
    }
}

function customRect(){
    this.x = 0;
    this.y = 0;
    this.w = 1;
    this.h = 1;
    this.fill = null;
}

function addRect(objectList,x,y,w,h,fill){
    var rect = new customRect;
    rect.x = x;
    rect.y = y;
    rect.w = w;
    rect.h = h;
    rect.fill = fill;
    objectList.push(rect);
}

