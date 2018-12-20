class Rectangle{
    constructor(x,y,w,h){
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
    }

    setFill(newFill){
        this._fill = newFill;
    }

    get fill(){
        return this._fill;
    }
}