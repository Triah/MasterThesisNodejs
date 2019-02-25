'use strict';

import Shape from '../abstract/shape.js';

export default class Square extends Shape{
    constructor(id, bounds, moveAble, collideAble, targetAble){
        super(id, bounds, moveAble, collideAble, targetAble);

        this.bounds = this.constructProperBounds(-200,-200);
    }

    constructProperBounds(w,h){
        var startX = this.bounds[0].x;
        var startY = this.bounds[0].y;

        if(this.bounds.length == 4){
            this.bounds[0] = { x:startX, y:startY };
            this.bounds[1] = { x:startX + w, y: startY };
            this.bounds[2] = { x:startX + w, y: startY + h };
            this.bounds[3] = { x: startX, y: startY + h};
            return this.bounds;
        } else {
            console.log("shape is not a square removing it from canvas");
            return this.bounds;
        }
    }

    

}