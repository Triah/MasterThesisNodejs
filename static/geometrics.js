//I need to get the bounds of the shapes
class Shape {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.colliding = false;
    }



    isCollidingWithOtherObject(objects) {
        var objectsList = objects;
        //calculate from other objects to this object
        this.calcCollisionOtherObjectsToThis(objectsList, this);
        //invert process to cover all lines and point cases
        this.calcCollisionThisToOtherObjects(objectsList, this);
    }

    calcCollisionThisToOtherObjects(objects,self){
        objects.forEach(obj => {
            if (obj != self) {
                var areas = [];
                var allBoundsForPoint = [];
                for (var i = 0; i < obj.getBounds().length; i++) {
                    var allBoundsForPoint = [];
                    //Functioning as intended
                    for (var j = 0; j < self.getBounds().length; j++) {
                        var bounds = [];
                        bounds.push({ x: self.getBounds()[j].x, y: self.getBounds()[j].y });
                        if (j != self.getBounds().length - 1) {
                            bounds.push({ x: self.getBounds()[j + 1].x, y: self.getBounds()[j + 1].y })
                        } else {
                            bounds.push({ x: self.getBounds()[0].x, y: self.getBounds()[0].y });
                        }
                        bounds.push({ x: obj.getBounds()[i].x, y: obj.getBounds()[i].y });
                        allBoundsForPoint.push(bounds);
                    }

                    //calculate the lengths of the sides
                    var sideLengths = self.calcSideLengths(allBoundsForPoint);

                    //functioning as intended
                    var sValues = self.calcSValue(sideLengths);

                    //calculating areas
                    areas.push(self.calcTemporaryAreaValues(sValues, sideLengths));

                    //For each of the triangles combine the areas
                    var totalAreas = self.calcArea(areas);

                    totalAreas.forEach(totalArea => {
                        //console.log(totalArea);
                        if (Math.floor(totalArea) == Math.floor(this.area())) {
                            console.log("colliding in this to other");
                        }
                    });
                    //Success boii though i need to optimize this later
                }
            }
        });
    }

    calcCollisionOtherObjectsToThis(objects,self){
        objects.forEach(obj => {
            if (obj != self) {
                var areas = [];
                var allBoundsForPoint = [];
                for (var i = 0; i < self.getBounds().length; i++) {
                    var allBoundsForPoint = [];
                    //Functioning as intended
                    for (var j = 0; j < obj.getBounds().length; j++) {
                        var bounds = [];
                        bounds.push({ x: obj.getBounds()[j].x, y: obj.getBounds()[j].y });
                        if (j != obj.getBounds().length - 1) {
                            bounds.push({ x: obj.getBounds()[j + 1].x, y: obj.getBounds()[j + 1].y })
                        } else {
                            bounds.push({ x: obj.getBounds()[0].x, y: obj.getBounds()[0].y });
                        }
                        bounds.push({ x: self.getBounds()[i].x, y: self.getBounds()[i].y });
                        allBoundsForPoint.push(bounds);
                    }

                    //calculate the lengths of the sides
                    var sideLengths = self.calcSideLengths(allBoundsForPoint);

                    //functioning as intended
                    var sValues = self.calcSValue(sideLengths);

                    //calculating areas
                    areas.push(self.calcTemporaryAreaValues(sValues, sideLengths));

                    //For each of the triangles combine the areas
                    var totalAreas = self.calcArea(areas);

                    totalAreas.forEach(totalArea => {
                        //console.log(totalArea);
                        if (Math.floor(totalArea) == Math.floor(obj.area())) {
                            console.log("colliding in other to this");
                        }
                    });
                    //Success boii though i need to optimize this later
                }
            }
        });
    }

    calcSideLengths(allBoundsForPoint) {
        var sideLengths = []
        for (var k = 0; k < allBoundsForPoint.length; k++) {
            var lengthsOfEachTriangle = [];
            for (var b = 0; b < allBoundsForPoint[k].length; b++) {
                if (b != allBoundsForPoint[k].length - 1) {
                    var vector = { x1: allBoundsForPoint[k][b].x, y1: allBoundsForPoint[k][b].y, x2: allBoundsForPoint[k][b + 1].x, y2: allBoundsForPoint[k][b + 1].y };
                } else {
                    var vector = { x1: allBoundsForPoint[k][b].x, y1: allBoundsForPoint[k][b].y, x2: allBoundsForPoint[k][0].x, y2: allBoundsForPoint[k][0].y };
                }
                var lengthx = vector.x2 - vector.x1;
                var lengthy = vector.y2 - vector.y1;
                var length = Math.sqrt(Math.pow(lengthx, 2) + Math.pow(lengthy, 2));
                lengthsOfEachTriangle.push(length);
            }
            sideLengths.push(lengthsOfEachTriangle);
        }
        return sideLengths;
    }

    calcArea(tempAreaValues) {
        var totalAreas = []
        for (var k = 0; k < tempAreaValues.length; k++) {
            var totalArea = 0
            for (var b = 0; b < tempAreaValues[k].length; b++) {
                totalArea += tempAreaValues[k][b];
            }
            totalAreas.push(totalArea);
        }
        return totalAreas;
    }

    calcTemporaryAreaValues(sValues, sideLengths) {
        var tempAreaValues = []
        for (var k = 0; k < sValues.length; k++) {
            var a = 0;
            for (var b = 0; b < sideLengths[k].length; b++) {
                if (a == 0) {
                    a = sValues[k] - sideLengths[k][b];
                } else {
                    a *= sValues[k] - sideLengths[k][b];
                }
            }
            tempAreaValues.push(a);
        }

        for (var k = 0; k < tempAreaValues.length; k++) {
            tempAreaValues[k] = sValues[k] * tempAreaValues[k];
            tempAreaValues[k] = Math.sqrt(tempAreaValues[k]);
        }
        return tempAreaValues;
    }

    calcSValue(sideLengthsArray) {
        var sValues = []
        for (var k = 0; k < sideLengthsArray.length; k++) {
            var s = 0;
            for (var b = 0; b < sideLengthsArray[k].length; b++) {
                s += sideLengthsArray[k][b];
            }
            s = s / 2;
            sValues.push(s);
        }
        return sValues;
    }

    getBounds(objects) { }
    getVectors() { }
}

class Square extends Shape {
    constructor(id, x, y, w, h) {
        super(id, x, y);
        this.w = w;
        this.h = h;
    }

    getCollisionArea(e) {
        if (e.x + 10 < this.x + this.w + 20 &&
            e.x + 10 > this.x &&
            e.y - 10 > this.y &&
            e.y - 10 < this.y + this.h) {
            this.colliding = true;
        } else {
            this.colliding = false;
        }
        return this.colliding
    }

    move(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        this.x = e.x - rect.left - this.w / 2;
        this.y = e.y - rect.top - this.h / 2;
    }

    area() {
        return this.w * this.h;
    }

    getBounds() {
        var bounds = [];
        bounds.push({ x: this.x, y: this.y });
        bounds.push({ x: this.x + this.w, y: this.y });
        bounds.push({ x: this.x + this.w, y: this.y + this.h });
        bounds.push({ x: this.x, y: this.y + this.h });
        return bounds;
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
}

class Circle extends Shape {
    constructor(id, x, y, r) {
        super(id, x, y);
        this.r = r;
    }

    getCollisionArea(e) {
        var distance = Math.sqrt(Math.pow((this.x + 15) - e.x, 2) + Math.pow((this.y + 10) - e.y, 2));
        if (distance < this.r) {
            this.colliding = true;
        } else {
            this.colliding = false;
        }
        return this.colliding;
    }

    getBounds() {
        //this gets the bounding rectangle for now
        var bounds = []
        bounds.push({ x: this.x - this.r, y: this.y - this.r }); //upper left corner
        bounds.push({ x: this.x + this.r, y: this.y - this.r }); //upper right corner
        bounds.push({ x: this.x + this.r, y: this.y + this.r }); //lower right cornor 
        bounds.push({ x: this.x - this.r, y: this.y + this.r }); //lower left cornor

        return bounds;
    }

    move(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        this.x = e.x - rect.left;
        this.y = e.y - rect.top;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        context.strokeStyle = "#000000";
        context.stroke();
        context.closePath();
    }
    area() {
        return (this.getBounds()[1].x - this.getBounds()[0].x) * (this.getBounds()[2].y - this.getBounds()[1].y);
    }
}

class FilledRectangle extends Square {
    constructor(id, x, y, w, h, fill, text, textColor) {
        super(id, x, y, w, h);
        this.fill = fill;
        this.text = text;
        this.textColor = textColor;
    }

    draw(context) {
        context.fillStyle = this.fill;
        context.fillRect(this.x, this.y, this.w, this.h);
        if (this.text != undefined) {
            context.fillStyle = this.textColor;
            context.textAlign = "center";
            context.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2);
        }
    }
}

class Rectangle extends Square {
    constructor(id, x, y, w, h, text) {
        super(id, x, y, w, h);
        this.text = text;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = "#000000"
        context.strokeRect(this.x, this.y, this.w, this.h);
        if (this.text != undefined) {
            context.textAlign = "center";
            context.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2);
        }
    }
}

class Triangle extends Shape {
    constructor(id, x, y, x2, y2, x3, y3) {
        super(id, x, y);
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x2, this.y2);
        context.lineTo(this.x3, this.y3);
        context.strokeStyle = "#000000"
        context.closePath();
        context.stroke();
    }

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

        if (Math.floor(eventArea) == Math.floor(this.area())) {
            this.colliding = true;
        } else {
            this.colliding = false;
        }
        return this.colliding;
    }


    area() {
        var sideLengths = [];
        for (var i = 0; i < this.getBounds().length; i++) {
            if (i != this.getBounds().length - 1) {
                var vector = { x1: this.getBounds()[i].x, y1: this.getBounds()[i].y, x2: this.getBounds()[i + 1].x, y2: this.getBounds()[i + 1].y };
            } else {
                var vector = { x1: this.getBounds()[i].x, y1: this.getBounds()[i].y, x2: this.getBounds()[0].x, y2: this.getBounds()[0].y };
            }
            var lengthx = vector.x2 - vector.x1;
            var lengthy = vector.y2 - vector.y1;
            var length = Math.sqrt(Math.pow(lengthx, 2) + Math.pow(lengthy, 2));
            sideLengths.push(length);
        }
        var s = 0;
        for (var i = 0; i < sideLengths.length; i++) {
            s += sideLengths[i];
        }
        s = s / 2;
        var a = 0;
        for (var i = 0; i < sideLengths.length; i++) {
            if (a == 0) {
                a = s - sideLengths[i];
            } else {
                a *= s - sideLengths[i];
            }
        }
        a = s * a;
        a = Math.sqrt(a);
        return a;
    }

    distanceX(p1, p2, canvas) {
        //temporary
        return (p1.x - canvas.getBoundingClientRect().left) - p2.x;
    }

    distanceY(p1, p2, canvas) {
        //temporary
        return (p1.y - canvas.getBoundingClientRect().top) - p2.y;
    }

    getCenter(p1, p2, p3) {
        var centerX = (p1.x + p2.x + p3.x) / 3;
        var centerY = (p1.y + p2.y + p3.y) / 3;
        var centerPoint = { x: centerX, y: centerY };
        return centerPoint;
    }

    getBounds() {
        var bounds = [];
        bounds.push({ x: this.x, y: this.y })
        bounds.push({ x: this.x2, y: this.y2 })
        bounds.push({ x: this.x3, y: this.y3 })
        return bounds;
    }

    move(canvas, e) {
        var point = { x: this.x, y: this.y };
        var point2 = { x: this.x2, y: this.y2 };
        var point3 = { x: this.x3, y: this.y3 };
        this.x = this.x + this.distanceX(e, this.getCenter(point, point2, point3), canvas);
        this.x2 = this.x2 + this.distanceX(e, this.getCenter(point, point2, point3), canvas);
        this.x3 = this.x3 + this.distanceX(e, this.getCenter(point, point2, point3), canvas);
        this.y = this.y + this.distanceY(e, this.getCenter(point, point2, point3), canvas);
        this.y2 = this.y2 + this.distanceY(e, this.getCenter(point, point2, point3), canvas);
        this.y3 = this.y3 + this.distanceY(e, this.getCenter(point, point2, point3), canvas);
    }
}
