class Grid {
    constructor(w,h,color){
        this.w = w;
        this.h = h;
        this.color = color;
    }

    display(canvas, context){
        var width = canvas.width;
        var height = canvas.height;
        var numberOfVerticalLines = Math.ceil(width / this.w);
        var numberOfHorizontalLines = Math.ceil(height / this.h);
        context.beginPath();
        for(var i = 0; i < numberOfVerticalLines; i++){
            context.moveTo(i*this.w, 0);
            context.lineTo(i*this.w, height);
        }
        for(var i = 0; i < numberOfHorizontalLines;i++){
            context.moveTo(0,i*this.h);
            context.lineTo(width, i*this.h);
        }
        context.lineWidth = 1;
        if(this.color != null || this.color != undefined){
            context.strokeStyle = this.color;
        } else {
            context.strokeStyle = "#D3D3D3"
        }
        context.stroke();
        context.closePath();

    }
}