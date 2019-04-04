'use strict';

import Shape from '../abstract/shape.js';

export default class MemoryCard extends Shape {
    constructor(id, bounds, moveAble, targetAble, color, text, textVisible,privateVariables,size){
        super(id, bounds, moveAble, targetAble, color, text, textVisible,size);
        this.privateVariables = privateVariables;
    }

    setDefaultForUninstantiatedParameters(canvas){
        super.setDefaultForUninstantiatedParameters(canvas);     
        this.privateVariables = {"cloneExists": undefined, "cloneId": undefined, "activeObjects": [], "locked": false };
    }

    init(objects){
        this.clone(objects);
    }

    setObjectName(object) {
        this.object = object;
    }

    process(e,objects){
        if(e.type == "mousedown"){
            this.checkMatching(objects,e);
        } 
    }

    checkMatching(list,e){
        if(this.getCollisionArea(e)){
            this.mouseDownEvent();
            if(this.textVisible && !this.privateVariables.locked){
                this.privateVariables.activeObjects.push(this.id);
            } else {
                for(var i = 0 ; i < this.privateVariables.activeObjects.length; i++){
                    if(this.privateVariables.activeObjects[i] == this.id && this.textVisible == false){
                        this.privateVariables.activeObjects.splice(i,1);
                    }
                }
            }
        }
        var lockedItems = [];
        for(var i = 0; i < list.length; i++){
            if(list[i].privateVariables.activeObjects.length == 2){
                if(list[i].privateVariables.activeObjects.indexOf(list[i].id) != -1){
                    list[i].privateVariables.locked = true;
                    lockedItems.push(list[i]);
                }
            }
        }
        var allItemsActivated = [];
        for(var i = 0; i < list.length; i++){
            if(list[i].privateVariables.activeObjects.length > 0) {
                for(var j = 0; j < list[i].privateVariables.activeObjects.length; j++){
                    if(allItemsActivated.indexOf(list[i].privateVariables.activeObjects[j]) == -1){
                        allItemsActivated.push(list[i].privateVariables.activeObjects[j]);
                    }
                }
            }
        }
        var lockedIds = []
        for(var i = 0; i < lockedItems.length; i++){
            lockedIds.push(lockedItems[i].id);
        }
        var nonpairedActive = []
        nonpairedActive = allItemsActivated.filter(id => !lockedIds.includes(id));

        console.log(nonpairedActive);
        if(nonpairedActive.length == 2){
            for(var i = 0; i < list.length; i++){
                for(var j = 0; j < nonpairedActive.length; j++){
                    if(list[i].id == nonpairedActive[j]){
                        list[i].privateVariables.activeObjects = [];                 
                    }
                }
                
            }
        }
        if(nonpairedActive.length > 0 && nonpairedActive.length < 2){
            for(var i = 0; i < list.length; i++){
                if(list[i].textVisible && list[i].privateVariables.activeObjects.indexOf(list[i].id) == -1){
                    list[i].textVisible = false
                }
            }
        }
    }

    clone(listToAddTo){
        for(var object in listToAddTo){
            if(listToAddTo[object].object == this.object){
                if(listToAddTo[object].privateVariables.cloneExists == undefined){
                    var clone = new MemoryCard(listToAddTo.length,[],listToAddTo[object].moveAble,
                    listToAddTo[object].targetAble,listToAddTo[object].color,listToAddTo[object].text,listToAddTo[object].textVisible,listToAddTo[object].privateVariables,listToAddTo[object].size);
                    listToAddTo[object].privateVariables.cloneExists = true;
                    for(var i = 0; i < listToAddTo[object].bounds.length;i++){
                        clone.bounds[i] = {x:listToAddTo[object].bounds[i].x , y:listToAddTo[object].bounds[i].y }; 
                    }
                    clone.privateVariables.cloneId = []
                    clone.setObjectName(this.object);
                    clone.privateVariables.cloneId.push(listToAddTo[object].id, clone.id)
                    listToAddTo.push(clone);
                }
            }
        }
    }

    mouseDownEvent(){
        if(!this.privateVariables.locked){
            if(this.textVisible){
            this.textVisible = false;
            } else if (!this.textVisible){
                this.textVisible = true;
            }
        }
    }
}
