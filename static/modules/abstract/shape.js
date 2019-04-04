'use strict';
export default class Shape {
    constructor(id, bounds, moveAble, targetAble, color, text, textVisible, size) {
        this.id = id;
        this.colliding;
        this.size = size;
        this.color = color;
        this.text = text;
        this.textVisible = textVisible;
        this.moveAble = moveAble;
        this.targetAble = targetAble;
        this.object = null;
        this.bounds = bounds;
    }

    setObjectName(object) {
        this.object = object;
    }

    init(objects){
        //do nothing
    }
    
    updateParams(paramToBeUpdated){
        if(paramToBeUpdated == "size"){
            this.scaleSize(this.size);
        }
    }

    /**
     * This method must be extended when creating a new object for it to be usable by the game creator
     * @param {canvas} canvas 
     */
    setDefaultForUninstantiatedParameters(canvas){
        if(this.bounds == null){
            this.bounds = [{x:canvas.width/2-100, y:canvas.height/2-100},{x:canvas.width/2+100, y:canvas.height/2-100},{x:canvas.width/2+100, y:canvas.height/2+100}, {x:canvas.width/2-100,y:canvas.height/2+100}];
        }
        if(this.moveAble == null){
            this.moveAble = true;
        }
        if(this.targetAble == null){
            this.targetAble = false;
        }
        if(this.color == null){
            this.color = "white";
        }
        if(this.text == null){
            this.text = "";
        }
        if(this.textVisible == null){
            this.textVisible = false;
        }
        if(this.size == null){
            this.size = 1;
        }
    }

    getDegreesForAngles(){
        var newBounds = [];
        for(var i = 0; i < this.bounds.length; i++){
            if(i != this.bounds.length-1){
                var angle = Math.atan2(this.bounds[i+1].y-this.bounds[i].y,this.bounds[i+1].x-this.bounds[i].x)
                var vectorLength = Math.sqrt(Math.pow(this.bounds[i+1].x-this.bounds[i].x, 2) + Math.pow(this.bounds[i+1].y-this.bounds[i].y, 2));
            } else {
                var angle = Math.atan2(this.bounds[0].y-this.bounds[i].y,this.bounds[0].x-this.bounds[i].x)
                var vectorLength = Math.sqrt(Math.pow(this.bounds[0].x-this.bounds[i].x, 2) + Math.pow(this.bounds[0].y-this.bounds[i].y, 2));
            }
            newBounds.push({x:Math.floor(this.bounds[i].x + vectorLength*Math.cos(angle)),y:Math.floor(this.bounds[i].y + vectorLength*Math.sin(angle))})
        }
        return newBounds;
    }

    scaleSize(multiplier){
        for(var i = 0; i < this.getDegreesForAngles().length; i++){
            if(i == this.getDegreesForAngles().length-1){
                this.bounds[0].x = this.getDegreesForAngles()[i].x*multiplier;
                this.bounds[0].y = this.getDegreesForAngles()[i].y*multiplier;   
            } else {
                this.bounds[i+1].x = this.getDegreesForAngles()[i].x*multiplier;
                this.bounds[i+1].y = this.getDegreesForAngles()[i].y*multiplier;   
            }
            
        }
        
    }


    getBounds() {
        return this.bounds;
    }

    getVectors() {
        var vectors = []
        for (var i = 0; i < this.getBounds().length; i++) {
            if (i != this.getBounds().length - 1) {
                var x1 = this.getBounds()[i].x;
                var y1 = this.getBounds()[i].y;
                var x2 = this.getBounds()[i + 1].x;
                var y2 = this.getBounds()[i + 1].y;
            } else {
                var x1 = this.getBounds()[i].x;
                var y1 = this.getBounds()[i].y;
                var x2 = this.getBounds()[0].x;
                var y2 = this.getBounds()[0].y;
            }
            vectors.push({ x1: x1, y1: y1, x2: x2, y2: y2 });

        }
        return vectors;
    }

    process(e,objects){
        //Do nothing
    }

    draw(context) {
        context.beginPath();
        if(this.color != ""){
            context.fillStyle = this.color;
        }
        context.moveTo(this.getBounds()[0].x, this.getBounds()[0].y);
        for (var i = 1; i < this.getBounds().length; i++) {
            context.lineTo(this.getBounds()[i].x, this.getBounds()[i].y);
        }
        context.strokeStyle = "#000000"
        context.closePath();
        context.fill();
        if (this.text != "" && this.textVisible) {
            context.font = "12px Arial";
            context.strokeText(this.text, this.bounds[0].x+10, this.getCenter().y);
        }
        context.stroke();
    }

    area() {
        var areas = [];
        for (var i = 0; i < this.getBounds().length; i++) {
            var sideLengths = [];
            var bounds = [];
            //get the bounds for each of the triangles
            bounds.push({ x: this.getBounds()[i].x, y: this.getBounds()[i].y });
            if (i != this.getBounds().length - 1) {
                bounds.push({ x: this.getBounds()[i + 1].x, y: this.getBounds()[i + 1].y })
            } else {
                bounds.push({ x: this.getBounds()[0].x, y: this.getBounds()[0].y });
            }
            bounds.push({ x: this.getCenter().x, y: this.getCenter().y });

            for (var j = 0; j < bounds.length; j++) {
                if (j != bounds.length - 1) {
                    var vector = { x1: bounds[j].x, y1: bounds[j].y, x2: bounds[j + 1].x, y2: bounds[j + 1].y };
                } else {
                    var vector = { x1: bounds[j].x, y1: bounds[j].y, x2: bounds[0].x, y2: bounds[0].y };
                }
                var lengthx = vector.x2 - vector.x1;
                var lengthy = vector.y2 - vector.y1;
                var length = Math.sqrt(Math.pow(lengthx, 2) + Math.pow(lengthy, 2));
                sideLengths.push(length);
            }

            var s = 0;
            for (var j = 0; j < sideLengths.length; j++) {
                s += sideLengths[j];
            }
            s = s / 2;
            var a = 0;

            for (var j = 0; j < sideLengths.length; j++) {
                if (a == 0) {
                    a = s - sideLengths[j];
                } else {
                    a *= s - sideLengths[j];
                }
            }

            a = s * a;
            a = Math.sqrt(a);
            areas.push(a);

            var area = 0
            for (var j = 0; j < areas.length; j++) {
                area += areas[j]
            }
        }
        return Math.floor(area);
    }

    //this is limited in irregular polygons as the triangles created need to be within the figure for it to work
    getCollisionArea(e) {
        var areas = [];
        for (var i = 0; i < this.getBounds().length; i++) {
            var sideLengths = [];
            var bounds = [];

            //get the bounds for each of the triangles
            bounds.push({ x: this.getBounds()[i].x, y: this.getBounds()[i].y });
            if (i != this.getBounds().length - 1) {
                bounds.push({ x: this.getBounds()[i + 1].x, y: this.getBounds()[i + 1].y })
            } else {
                bounds.push({ x: this.getBounds()[0].x, y: this.getBounds()[0].y });
            }
            bounds.push({ x: e.x - canvas.getBoundingClientRect().left, y: e.y - canvas.getBoundingClientRect().top });

            for (var j = 0; j < bounds.length; j++) {
                if (j != bounds.length - 1) {
                    var vector = { x1: bounds[j].x, y1: bounds[j].y, x2: bounds[j + 1].x, y2: bounds[j + 1].y };
                } else {
                    var vector = { x1: bounds[j].x, y1: bounds[j].y, x2: bounds[0].x, y2: bounds[0].y };
                }
                var lengthx = vector.x2 - vector.x1;
                var lengthy = vector.y2 - vector.y1;
                var length = Math.sqrt(Math.pow(lengthx, 2) + Math.pow(lengthy, 2));
                sideLengths.push(length);
            }

            var s = 0;
            for (var j = 0; j < sideLengths.length; j++) {
                s += sideLengths[j];
            }
            s = s / 2;
            var a = 0;

            for (var j = 0; j < sideLengths.length; j++) {
                if (a == 0) {
                    a = s - sideLengths[j];
                } else {
                    a *= s - sideLengths[j];
                }
            }

            a = s * a;
            a = Math.sqrt(a);
            areas.push(a);
        }

        var eventArea = 0
        for (var i = 0; i < areas.length; i++) {
            eventArea += areas[i]
        }

        var buffer = 20;
        if (Math.floor(eventArea) - Math.floor(this.area()) < 20) {
            this.colliding = true;
        } else {
            this.colliding = false;
        }
        return this.colliding;
    }


    distanceX(p1, p2, canvas) {
        //temporary
        return (p1.x - canvas.getBoundingClientRect().left) - p2.x;
    }

    distanceY(p1, p2, canvas) {
        //temporary
        return (p1.y - canvas.getBoundingClientRect().top) - p2.y;
    }

    getCenter() {
        var centerX = 0
        for (var i = 0; i < this.getBounds().length; i++) {
            centerX += this.getBounds()[i].x;
        }
        centerX = centerX / this.getBounds().length;
        var centerY = 0;
        for (var i = 0; i < this.getBounds().length; i++) {
            centerY += this.getBounds()[i].y;
        }
        centerY = centerY / this.getBounds().length;
        var centerPoint = { x: centerX, y: centerY };
        return centerPoint;
    }

    move(canvas, e) {
        var moveDistanceX = this.distanceX(e, this.getCenter(), canvas);
        var moveDistanceY = this.distanceY(e, this.getCenter(), canvas);
        for (var i = 0; i < this.getBounds().length; i++) {
            this.bounds[i].x = this.bounds[i].x + moveDistanceX;
            this.bounds[i].y = this.bounds[i].y + moveDistanceY;
        }
    }


}