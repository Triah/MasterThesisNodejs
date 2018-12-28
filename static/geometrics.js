
class Shape{
    constructor(id, x,y){
        this.id = id;
        this.x = x;
        this.y = y;
        this.colliding = false;
    }
}

class Square extends Shape{
    constructor(id,x,y,w,h){
        super(id,x,y);
        this.w = w;
        this.h = h;
    }

    getCollisionArea(e){
        if(e.x+10 < this.x + this.w +20 && 
            e.x+10 > this.x && 
            e.y - 10 > this.y &&
            e.y - 10 < this.y + this.h){
            this.colliding = true;
        } else {
            this.colliding = false;
        }
        return this.colliding
    }

    move(e){
        this.x = e.x - 10 - this.w/2;
        this.y = e.y - 10 - this.h/2;
    }

    area(){
        return w*h;
    }
}

class Circle extends Shape{
    constructor(id,x,y,r){
        super(id,x,y);
        this.r = r;
    }

    getCollisionArea(e){
        var distance = Math.sqrt(Math.pow((this.x +15) - e.x,2) + Math.pow((this.y+10)-e.y,2));
        if(distance < this.r){
            this.colliding = true;
        } else {
            this.colliding = false;
        }
        return this.colliding;
    }

    move(e){
        this.x = e.x - 10;
        this.y = e.y - 10;
    }

    draw(context){
        context.beginPath();
        context.arc(this.x,this.y,this.r,0,2*Math.PI, false);
        context.stroke();
    }
}

class FilledRectangle extends Square{
    constructor(id,x,y,w,h,fill,text,textColor){
        super(id,x,y,w,h);
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
    constructor(id,x,y,w,h,text){
        super(id,x,y,w,h);
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
