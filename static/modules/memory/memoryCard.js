'use strict';

import Shape from '../abstract/shape.js';

export default class MemoryCard extends Shape {
    constructor(id, bounds, moveAble, targetAble, color, text, textVisible){
        super(id, bounds, moveAble, targetAble, color, text, textVisible);
        //Need an image
        //Needs an image-visible bool
        //Need a match bool
        //Needs a clone of some kind
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
        if(e.type == "mousedown"){
            this.mouseDownEvent();
        } 
        if(e.type == "mousemove"){
            //this serves mostly as a way of showcasing how to do logic for each component to individualize it.
            //console.log("mousemoveevent");
        }
        if(e.type == "mouseup"){
            //console.log("mouseupevent");
        }
    }

    mouseDownEvent(){
        if(this.textVisible){
            this.textVisible = false;
        } else if (!this.textVisible){
            this.textVisible = true;
        }
        console.log(this.textVisible);
        
    }
}
