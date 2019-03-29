'use strict';

import Shape from '../abstract/shape.js';

export default class MemoryCard extends Shape {
    constructor(id, bounds, moveAble, targetAble){
        super(id,bounds,moveAble,targetAble);
    }

    setDefaultForUninstantiatedParameters(canvas){
        super.setDefaultForUninstantiatedParameters(canvas);
        //Add new parameters
    }

    setObjectName(object) {
        this.object = object;
    }
}
