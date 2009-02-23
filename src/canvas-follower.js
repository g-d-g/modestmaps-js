// namespacing!
if (!com) {
    var com = { };
    if (!com.modestmaps) {
        com.modestmaps = { };
    }
}

com.modestmaps.Follower = function(map, location, content)
{
    this.coord = map.provider.locationCoordinate(location);
    
    this.offset = new com.modestmaps.Point(0, 0);
    this.dimensions = new com.modestmaps.Point(150, 150);
    this.margin = new com.modestmaps.Point(10, 10);
    this.offset = new com.modestmaps.Point(0, -this.dimensions.y);

    var follower = this;
    
    var callback = function(m, a) { return follower.draw(m); };
    map.addCallback('panned', callback);
    map.addCallback('zoomed', callback);
    map.addCallback('centered', callback);
    map.addCallback('extentset', callback);
    
    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.width = this.dimensions.x + 'px';
    this.div.style.height = this.dimensions.y + 'px';
    
    //this.div.style.backgroundColor = 'white';
    //this.div.style.border = 'solid black 1px';

    var shadow = document.createElement('canvas');
    this.div.appendChild(shadow);
    if (G_vmlCanvasManager) shadow = G_vmlCanvasManager.initElement(shadow);
    shadow.style.position = 'absolute';
    shadow.style.left = '0px';
    shadow.style.top = '0px';
    shadow.width = this.dimensions.x*2;
    shadow.height = this.dimensions.y;
    var ctx = shadow.getContext("2d");
    ctx.transform(1, 0, -0.5, 0.5, 75, this.dimensions.y/2);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    this.drawBubblePath(ctx);
    ctx.fill();

    var bubble = document.createElement('canvas');
    this.div.appendChild(bubble);
    if (G_vmlCanvasManager) bubble = G_vmlCanvasManager.initElement(bubble);
    bubble.style.position = 'absolute';
    bubble.style.left = '0px';
    bubble.style.top = '0px';
    bubble.width = this.dimensions.x;
    bubble.height = this.dimensions.y;
    var bubCtx = bubble.getContext('2d');
    bubCtx.strokeStyle = 'black';
    bubCtx.fillStyle = 'white';
    this.drawBubblePath(bubCtx);
    bubCtx.fill();    
    bubCtx.stroke();    
    
    var contentDiv = document.createElement('div');
    contentDiv.style.position = 'absolute';
    contentDiv.style.left = '0px';
    contentDiv.style.top = '0px';
    contentDiv.style.overflow = 'hidden';    
    contentDiv.style.width = (this.dimensions.x - this.margin.x) + 'px';
    contentDiv.style.height = (this.dimensions.y - this.margin.y - 25) + 'px';    
    contentDiv.style.padding = this.margin.y + 'px ' + this.margin.x + 'px ' + this.margin.y + 'px ' + this.margin.x + 'px';
    contentDiv.innerHTML = content;    
    this.div.appendChild(contentDiv);
    
    com.modestmaps.addEvent(contentDiv, 'mousedown', function(e) {
        if(!e) e = window.event;
        return com.modestmaps.cancelEvent(e);
    });
    
    map.parent.appendChild(this.div);
    
    this.draw(map);
}

com.modestmaps.Follower.prototype = {

    div: null,
    coord: null,
    
    offset: null,
    dimensions: null,
    margin: null,

    draw: function(map)
    {
        try {
            var point = map.coordinatePoint(this.coord);

        } catch(e) {
            // too soon?
            return;
        }
        
        if(point.x + this.dimensions.x + this.offset.x < 0) {
            // too far left
            this.div.style.display = 'none';
        
        } else if(point.y + this.dimensions.y + this.offset.y < 0) {
            // too far up
            this.div.style.display = 'none';
        
        } else if(point.x + this.offset.x > map.dimensions.x) {
            // too far right
            this.div.style.display = 'none';
        
        } else if(point.y + this.offset.y > map.dimensions.y) {
            // too far down
            this.div.style.display = 'none';

        } else {
            this.div.style.display = 'block';
            this.div.style.left = point.x + this.offset.x + 'px';
            this.div.style.top = point.y + this.offset.y + 'px';
        }
    },
    
    drawBubblePath: function(ctx) {
        ctx.beginPath();
        ctx.moveTo(10, this.dimensions.y);
        ctx.lineTo(35, this.dimensions.y-25);
        ctx.lineTo(this.dimensions.x-10, this.dimensions.y-25); 
        ctx.quadraticCurveTo(this.dimensions.x, this.dimensions.y-25, this.dimensions.x, this.dimensions.y-35);
        ctx.lineTo(this.dimensions.x, 10);
        ctx.quadraticCurveTo(this.dimensions.x, 0, this.dimensions.x-10, 0);
        ctx.lineTo(10, 0);
        ctx.quadraticCurveTo(0, 0, 0, 10);
        ctx.lineTo(0, this.dimensions.y-35);
        ctx.quadraticCurveTo(0, this.dimensions.y-25, 10, this.dimensions.y-25);
        ctx.lineTo(15, this.dimensions.y-25);
        ctx.moveTo(10, this.dimensions.y);
    }

};
