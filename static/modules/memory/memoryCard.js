'use strict';

import Shape from '../abstract/shape.js';

export default class MemoryCard extends Shape {
    constructor(id, bounds, moveAble, targetAble, color, text, textVisible, privateVariables, size, imageURL) {
        super(id, bounds, moveAble, targetAble, color, text, textVisible, size);
        this.privateVariables = privateVariables;
        this.imageURL = imageURL;
    }


    setDefaultForUninstantiatedParameters(canvas) {
        super.setDefaultForUninstantiatedParameters(canvas);
        this.targetAble = true;
        if(this.imageURL == null){
            this.imageURL = "";
        }
        if (this.privateVariables == null) {
            this.privateVariables = { "cloneExists": undefined, "activeVariables": [], "locked": false, "cloneId": [] };
        }
        else {
            this.privateVariables.activeObjects = [];
            this.privateVariables.locked = false;
        }

    }

    init(objects) {
        if (this.privateVariables.cloneExists == undefined) {
            this.clone(objects);
        }

    }

    setObjectName(object) {
        this.object = object;
    }

    draw(context) {
        context.beginPath();
        if(this.color != ""){
            context.fillStyle = this.color;
        }
        context.moveTo(this.getBounds()[0].x, this.getBounds()[0].y);
        for (var i = 1; i < this.getBounds().length; i++) {
            context.lineTo(this.getBounds()[i].x, this.getBounds()[i].y);
        }
        context.strokeStyle = "#000000"
        context.closePath();
        context.fill();
        if (this.text != "" && this.textVisible) {
            context.font = "12px Arial";
            context.strokeText(this.text, this.bounds[0].x+10, this.getCenter().y);
        }
        context.stroke();
        if(this.imageURL != null){
            if(this.textVisible){
                var img = new Image()
                img.src = this.imageURL;
                var bounds = this.getBounds();
                img.onload = function(){
                    context.drawImage(img, bounds[0].x, bounds[0].y, Math.sqrt(Math.pow(bounds[1].x-bounds[0].x, 2) + Math.pow(bounds[1].y-bounds[0].y, 2)),Math.sqrt(Math.pow(bounds[2].x-bounds[1].x, 2) + Math.pow(bounds[2].y-bounds[1].y, 2)))
                }
            }
            
        }
    }

    process(e, objects, socket) {
        if (e.type == "mousedown") {
            this.checkMatching(objects, e, socket);
        }
    }

    checkMatching(list, e, socket) {
        var reset = false;
        var nonpairedActive = [];

        var untargetables = [];
        for(var i = 0; i < list.length; i++){
            if(list[i].object == this.object){
                if(!list[i].targetAble){
                    untargetables.push(list[i]);
                }
            }
        }

        for(var i = 0; i < list.length; i++){
            if(list[i].privateVariables.locked){
                for(var obj in untargetables){
                    if(untargetables[obj].id == list[i].id){
                        untargetables.splice(obj,1);
                    }
                }
            }
        }

        for(var i = 0; i < untargetables.length; i++){
            if(untargetables.length == 2){
                if(!untargetables[i].privateVariables.locked){
                    untargetables[i].targetAble = true;
                    untargetables[i].textVisible = false;
                }
            }
        }

        if (this.getCollisionArea(e)) {
            if (this.targetAble) {
                this.mouseDownEvent();
                if (this.textVisible && !this.privateVariables.locked) {
                    if (list[this.privateVariables.cloneId[0]].privateVariables.activeObjects.indexOf(this.id) == -1) {
                        list[this.privateVariables.cloneId[0]].privateVariables.activeObjects.push(this.id);
                    }
                    if (list[this.privateVariables.cloneId[1]].privateVariables.activeObjects.indexOf(this.id) == -1) {
                        list[this.privateVariables.cloneId[1]].privateVariables.activeObjects.push(this.id);
                    }
                    this.targetAble = false;
                } else {
                    for (var i = 0; i < this.privateVariables.activeObjects.length; i++) {
                        if (this.privateVariables.activeObjects[i] == this.id && this.textVisible == false) {
                            this.privateVariables.activeObjects.splice(i, 1);
                        }
                    }
                }

                var lockedItems = [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].privateVariables.activeObjects.length == 2) {
                        if (list[i].privateVariables.activeObjects.indexOf(list[i].id) != -1) {
                            if(!list[list[i].privateVariables.activeObjects[0]].targetAble && !list[list[i].privateVariables.activeObjects[1]].targetAble){
                                list[i].privateVariables.locked = true;
                                lockedItems.push(list[i]);
                            }
                        }
                    }
                }

                var allItemsActivated = [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].privateVariables.activeObjects.length > 0) {
                        for (var j = 0; j < list[i].privateVariables.activeObjects.length; j++) {
                            if (allItemsActivated.indexOf(list[i].privateVariables.activeObjects[j]) == -1) {
                                allItemsActivated.push(list[i].privateVariables.activeObjects[j]);
                            }
                        }
                    }
                }
                var lockedIds = []
                for (var i = 0; i < lockedItems.length; i++) {
                    lockedIds.push(lockedItems[i].id);
                }
                console.log(socket);
                socket.emit('updateState', list);
            }
        }

    }

    clone(listToAddTo) {
        if (this.object != null) {
            for (var object in listToAddTo) {
                if (listToAddTo[object].object == this.object) {
                    if (listToAddTo[object].privateVariables.cloneExists == undefined) {
                        if (this.object != null) {
                            var clone = eval("new " + this.object + "(" + " listToAddTo.length,[],listToAddTo[object].moveAble," +
                                "listToAddTo[object].targetAble,listToAddTo[object].color,listToAddTo[object].text,listToAddTo[object].textVisible,listToAddTo[object].privateVariables,listToAddTo[object].size,listToAddTo[object].imageURL" + ")");
                        }
                        listToAddTo[object].privateVariables.cloneExists = true;
                        for (var i = 0; i < listToAddTo[object].bounds.length; i++) {
                            clone.bounds[i] = { x: listToAddTo[object].bounds[i].x, y: listToAddTo[object].bounds[i].y };
                        }
                        clone.privateVariables.cloneId = []
                        clone.setObjectName(this.object);
                        clone.privateVariables.cloneId.push(listToAddTo[object].id, clone.id)
                        listToAddTo.push(clone);
                    }
                }
            }
        }
    }

    mouseDownEvent() {
        if (!this.privateVariables.locked) {
            if (this.textVisible) {
                this.textVisible = false;
            } else if (!this.textVisible) {
                this.textVisible = true;
            }
        }
    }
}
