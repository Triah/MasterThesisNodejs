'use strict';

import Shape from '../abstract/shape.js';

export default class MemoryCard extends Shape {
    constructor(id, bounds, moveAble, targetAble, color, text, textVisible,size,privateVariables){
        super(id, bounds, moveAble, targetAble, color, text, textVisible,size);
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

    init(objects){
        this.clone(objects);
    }

    setObjectName(object) {
        this.object = object;
    }

    process(e,objects){
        if(e.type == "mousedown"){
            this.mouseDownEvent();
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
        for(var object in listToAddTo){
            if(listToAddTo[object].object == this.object){
                if(listToAddTo[object].privateVariables.cloneExists == undefined){
                    var clone = new MemoryCard(listToAddTo.length,[{"x":200,"y":400},{"x":500, "y":400}, {"x": 500, "y":700}, {"x":200,"y":700}],listToAddTo[object].moveAble,
                    listToAddTo[object].targetAble,listToAddTo[object].color,listToAddTo[object].text,listToAddTo[object].textVisible,listToAddTo[object].privateVariables);
                    listToAddTo[object].privateVariables.cloneExists = true;
                    clone.privateVariables.cloneId = []
                    clone.privateVariables.cloneId.push(listToAddTo[object].id, clone.id)
                    listToAddTo.push(clone);
                    console.log(clone.privateVariables.cloneId);
                }
            }
        }
        /*this.privateVariables.cloneExists = true;
        this.privateVariables.cloneId = [];
        var testObj = new MemoryCard(listToAddTo.length,[{"x":200,"y":400},{"x":500, "y":400}, {"x": 500, "y":700}, {"x":200,"y":700}],this.moveAble,this.targetAble,this.color,this.text,this.textVisible, this.privateVariables);
        this.privateVariables.cloneId.push(this.id, testObj.id);*/
        //listToAddTo.push(testObj);
    }

    mouseDownEvent(){
        if(this.textVisible){
            this.textVisible = false;
        } else if (!this.textVisible){
            this.textVisible = true;
        }
    }
}
