'use strict';

import Shape from '../abstract/shape.js';

export default class CollisionShape extends Shape {
    constructor(id, bounds,moveAble,collideAble,targetAble) {
        super(id,bounds,moveAble,collideAble,targetAble);
        this.colliding = false;
    }

    setDefaultForUninstantiatedParameters(canvas){
        super.setDefaultForUninstantiatedParameters(canvas);
        this.collideAble = true;
        console.log(this);
    }

    isCollidingWithOtherObject(objects) {
        var collision = null;
        if(this.calcCollisionOtherObjectsToThis(objects, this) != null){
            //calculate from other objects to this object
            collision = this.calcCollisionOtherObjectsToThis(objects, this);
        } else if (this.calcCollisionThisToOtherObjects(objects, this) != null){
            //invert process to cover all lines and point cases
            collision = this.calcCollisionThisToOtherObjects(objects, this);
        }
        return collision;
    }

    calcCollisionThisToOtherObjects(objects,self){
        var collision = null;
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

                    for(var k = 0; k < totalAreas.length; k++){
                        if (Math.floor(totalAreas[k]) == Math.floor(self.area())) {
                            collision = {firstObj: self, secondObj: obj, cornerForCollision: k};
                        }
                    }
                }
            }
        });
        return collision;
    }

    calcCollisionOtherObjectsToThis(objects,self){
        var collision = null;
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

                    for(var k = 0; k < totalAreas.length; k++){
                        if (Math.floor(totalAreas[k]) == Math.floor(obj.area())) {
                            collision = {firstObj: obj, secondObj: self, cornerForCollision: k};
                        }
                    }
                }
            }
        });
        return collision;
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

}