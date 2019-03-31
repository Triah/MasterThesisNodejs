'use strict';

import Shape from '../abstract/shape.js';

export default class MemoryCard extends Shape {
    constructor(id, bounds, moveAble, targetAble, color, text, textVisible,privateVariables){
        super(id, bounds, moveAble, targetAble, color, text, textVisible);
        //Need an image
        //Needs an image-visible bool
        //Need a match bool
        //Needs a clone of some kind
        this.privateVariables = privateVariables;
    }

    setDefaultForUninstantiatedParameters(canvas){
        super.setDefaultForUninstantiatedParameters(canvas);

        this.privateVariables = {"cloneExists": undefined, "cloneId": undefined};
        //Add new parameters
        //create a clone of object and link them but let them be seperate objects.
    }

    setObjectName(object) {
        this.object = object;
    }

    process(e,objects){
        if(e.type == "mousedown"){
            this.mouseDownEvent();
            this.clone(objects);
            for(var i = 0; i < objects.length; i++){
                console.log(objects[i]);
            }
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
        if(this.privateVariables.cloneExists == undefined){
            this.privateVariables.cloneExists = true;
            this.privateVariables.cloneId = [];
            var testObj = new MemoryCard(listToAddTo.length,[{"x":400,"y":400},{"x":700, "y":400}, {"x": 700, "y":700}, {"x":400,"y":700}],this.moveAble,this.targetAble,this.color,this.text,this.textVisible, this.privateVariables);
            this.privateVariables.cloneId.push(this.id, testObj.id);
            listToAddTo.push(testObj);
            
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
