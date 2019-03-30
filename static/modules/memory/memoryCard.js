'use strict';

import Shape from '../abstract/shape.js';

export default class MemoryCard extends Shape {
    constructor(id, bounds, moveAble, targetAble){
        super(id,bounds,moveAble,targetAble);
        //Need a color
        //Need a clickevent
        //Need an image
        //Needs text
        //Needs a text-visible bool
        //Needs an image-visible bool
        //Need a match bool
    }

    setDefaultForUninstantiatedParameters(canvas){
        super.setDefaultForUninstantiatedParameters(canvas);
        //Add new parameters
        //create a clone of object and link them but let them be seperate objects.
    }

    setObjectName(object) {
        this.object = object;
    }

    process(e){
        console.log(e);
    }
}
