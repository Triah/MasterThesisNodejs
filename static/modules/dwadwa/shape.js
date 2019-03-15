'use strict';
export default class Shape {
    constructor(id, bounds, moveAble, collideAble, targetAble) {
        this.id = id;
        this.bounds = bounds;
        this.colliding;
        this.moveAble = moveAble;
        this.collideAble = collideAble;
        this.targetAble = targetAble;
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

    draw(context) {
        context.beginPath();
        context.moveTo(this.getBounds()[0].x, this.getBounds()[0].y);
        for (var i = 1; i < this.getBounds().length; i++) {
            context.lineTo(this.getBounds()[i].x, this.getBounds()[i].y);
        }
        context.strokeStyle = "#000000"
        context.closePath();
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