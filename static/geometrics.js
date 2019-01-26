
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

class Triangle extends Shape{
    constructor(id,x,y,x2,y2,x3,y3){
        super(id,x,y);
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
    }

    draw(context){
        context.beginPath();
        context.moveTo(this.x,this.y);
        context.lineTo(this.x2,this.y2);
        context.lineTo(this.x3,this.y3);
        context.closePath();
        context.stroke();
    }

    getCollisionArea(e){
        //Heron's formula is used for this
        var area1 = Math.abs((this.x-e.x)*(this.y2-e.y)-(this.x2-e.x)*(this.y-e.y));
        var area3 = Math.abs((this.x2-e.x)*(this.y3-e.y)-(this.x3-e.x)*(this.y2-e.y));
        var area2 = Math.abs((this.x3-e.x)*(this.y-e.y)-(this.x-e.x)*(this.y3-e.y));
        if(area1+area2+area3 == this.area()){
            this.colliding = true;
        } else {
            this.colliding = false;
        }
        console.log(this.colliding);
        return this.colliding;
    }
    

    area(){
        return Math.abs((this.x2-this.x)*(this.y3-this.y)-(this.x3-this.x)*(this.y2-this.y));
    }

    distanceX(p1,p2){
        //temporary
        return p1.x - p2.x;
    }

    distanceY(p1,p2){
        //temporary
        return p1.y - p2.y;
    }

    getCenter(p1,p2,p3){
        var centerX = (p1.x + p2.x + p3.x)/3;
        var centerY = (p1.y + p2.y + p3.y)/3;
        var centerPoint = {x:centerX, y: centerY};
        return centerPoint;
    }

    move(e){
        var point = {x: this.x, y: this.y};
        var point2 = {x: this.x2, y: this.y2};
        var point3 = {x: this.x3, y: this.y3};
        this.x = this.x + this.distanceX(e,this.getCenter(point,point2,point3));
        this.x2 = this.x2 + this.distanceX(e,this.getCenter(point,point2,point3));
        this.x3 = this.x3 + this.distanceX(e,this.getCenter(point,point2,point3));  
        this.y = this.y + this.distanceY(e,this.getCenter(point,point2,point3));
        this.y2 = this.y2 + this.distanceY(e,this.getCenter(point,point2,point3));
        this.y3 = this.y3 + this.distanceY(e,this.getCenter(point,point2,point3));
    }
}
