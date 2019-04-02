'use strict';

import Shape from '../abstract/shape.js';

export default class MemoryCard extends Shape {
    constructor(id, bounds, moveAble, targetAble, color, text, textVisible,privateVariables,size){
        super(id, bounds, moveAble, targetAble, color, text, textVisible,size);
        //Need an image
        //Needs an image-visible bool
        this.privateVariables = privateVariables;
    }

    setDefaultForUninstantiatedParameters(canvas){
        super.setDefaultForUninstantiatedParameters(canvas);

        this.privateVariables = {"cloneExists": undefined, "cloneId": undefined};
        //Add new parameters
        //create a clone of object and link them but let them be seperate objects.
    }

    init(objects){
        this.clone(objects);
    }

    setObjectName(object) {
        this.object = object;
    }

    process(e,objects){
        if(e.type == "mousedown"){
            this.mouseDownEvent();
            this.scaleSize(0.9);
        } 
        if(e.type == "mousemove"){
            //this serves mostly as a way of showcasing how to do logic for each component to individualize it.
            //console.log("mousemoveevent");
        }
        if(e.type == "mouseup"){
            //console.log("mouseupevent");
        }
    }

    clone(listToAddTo){
        for(var object in listToAddTo){
            if(listToAddTo[object].object == this.object){
                if(listToAddTo[object].privateVariables.cloneExists == undefined){
                    var clone = new MemoryCard(listToAddTo.length,[{"x":200,"y":400},{"x":500, "y":400}, {"x": 500, "y":700}, {"x":200,"y":700}],listToAddTo[object].moveAble,
                    listToAddTo[object].targetAble,listToAddTo[object].color,listToAddTo[object].text,listToAddTo[object].textVisible,listToAddTo[object].privateVariables,listToAddTo[object].size);
                    listToAddTo[object].privateVariables.cloneExists = true;
                    console.log(clone);
                    clone.privateVariables.cloneId = []
                    clone.privateVariables.cloneId.push(listToAddTo[object].id, clone.id)
                    listToAddTo.push(clone);
                    console.log(clone.privateVariables.cloneId);
                }
            }
        }
    }

    mouseDownEvent(){
        if(this.textVisible){
            this.textVisible = false;
        } else if (!this.textVisible){
            this.textVisible = true;
        }
    }
}
