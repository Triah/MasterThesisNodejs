class Shape{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class Square extends Shape{
    constructor(x,y,w,h){
        super(x,y);
        this.w = w;
        this.h = h;
    }

    area(){
        return w*h;
    }
}

class Circle extends Shape{
    constructor(x,y,r){
        super(x,y);
        this.r = r;
    }

    draw(context){
        context.beginPath();
        context.arc(this.x,this.y,this.r,0,2*Math.PI, false);
        context.stroke();
    }
}

class FilledRectangle extends Square{
    constructor(x,y,w,h,fill,text,textColor){
        super(x,y,w,h);
        this.fill = fill;
        this.text = text;
        this.textColor = textColor;
    }

    draw(context){
        context.fillStyle = this.fill;
        context.fillRect(this.x,this.y,this.w,this.h);
        if(this.text != undefined){
            context.fillStyle = this.textColor;
            context.textAlign ="center";
            context.fillText(this.text, this.x +this.w/2, this.y + this.h/2);
        }
    }
}

class Rectangle extends Square{
    constructor(x,y,w,h,text){
        super(x,y,w,h);
        this.text = text;
    }

    draw(context){
        context.beginPath();
        context.strokeRect(this.x,this.y,this.w,this.h);
        if(this.text != undefined){
            context.textAlign = "center";
            context.fillText(this.text, this.x + this.w /2, this.y + this.h /2);
        }
    }
}
