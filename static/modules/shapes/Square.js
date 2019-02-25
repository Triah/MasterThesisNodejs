'use strict';

import Shape from '../abstract/shape.js';

class Square extends Shape{
    constructor(id, bounds, moveAble, collideAble, targetAble){
        super(id, bounds, moveAble, collideAble, targetAble);
    }

    constructProperBounds(w,h){
        var startX = this.bounds[0].x;
        var startY = this.bounds[0].y;

        if(bounds.length == 4){
            bounds[0] = { x:startX, y:startY };
            bounds[1] = { x:startX + w, y: startY };
            bounds[2] = { x:startX + w, y: startY + h };
            bounds[3] = { x: startX, y: startY + h};
        } else {
            console.log("shape is not a square removing it from canvas");
            this = null;
        }
    }

    

}