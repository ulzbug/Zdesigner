
dbd.objects.Link = function Link(source, destination)
{
    this.source = source;
    this.destination = destination;
}

dbd.objects.Link.prototype = new dbd.objects.Renderable;

dbd.objects.Link.prototype.draw = function()
{
    var source = { x : 0, y : 0 };
    var destination = { x : 0, y : 0 };    
    var point1 = { x : 0, y : 0 };
    var point2 = { x : 0, y : 0 };
    var ctrlPoint1 = { x : 0, y : 0 };
    var ctrlPoint2 = { x : 0, y : 0 };
    var fleche = '';
    var point_fleche;
    
    source.x = $('#'+this.source).offset().left;
    source.y = $('#'+this.source).offset().top + $('#'+this.source).height() / 2;  
    
    destination.x = $('#'+this.destination).offset().left;
    destination.y = $('#'+this.destination).offset().top + $('#'+this.destination).height() / 2;
    
    if(source.x + $('#'+this.source).width() < destination.x)
    {
        point1 = { x : source.x + $('#'+this.source).width(), y : source.y};
        point2 = { x : destination.x, y : destination.y};
        
        var distance = point2.x - point1.x;
        
        ctrlPoint1.x = point1.x + distance * 0.6;
        ctrlPoint1.y = point1.y;
        
        ctrlPoint2.x = point2.x - distance * 0.6;
        ctrlPoint2.y = point2.y;
        
        fleche = 'droite';
        point_fleche = point2;
        point_fleche.x -= 1;
    }
    else if(destination.x + $('#'+this.destination).width() < source.x)
    {
        point1 = { x : destination.x + $('#'+this.destination).width(), y : destination.y};
        point2 = { x : source.x, y : source.y};
        
        var distance = point2.x - point1.x;
        
        ctrlPoint1.x = point1.x + distance * 0.6;
        ctrlPoint1.y = point1.y;
        
        ctrlPoint2.x = point2.x - distance * 0.6;
        ctrlPoint2.y = point2.y;
        
        fleche = 'gauche';
        point_fleche = point1;
        point_fleche.x += 2;
    }
    else 
    {
        var a1 = destination.x;
        var a2 = destination.x + $('#'+this.destination).width();        
        var b1 = source.x;
        var b2 = source.x + $('#'+this.source).width();
        
        if( Math.abs(a1 - b1) > Math.abs(a2 - b2) && Math.abs(a2 - b2) < 50 || Math.abs(a1 - b1) < Math.abs(a2 - b2) && Math.abs(a2 - b2) > 50)
        {
            point1 = { x : destination.x + $('#'+this.destination).width(), y : destination.y};
            point2 = { x : source.x + $('#'+this.source).width(), y : source.y};
            
            var distance = Math.max(50, Math.abs(a2 - b2) * 0.6);
            
            ctrlPoint1.x = point1.x + distance;
            ctrlPoint1.y = point1.y;
            
            ctrlPoint2.x = point2.x + distance;
            ctrlPoint2.y = point2.y;
            
            fleche = 'gauche';
            point_fleche = point1;
            point_fleche.x += 2;
        }
        else
        {
            point1 = { x : destination.x, y : destination.y};
            point2 = { x : source.x, y : source.y};
            
            var distance = Math.max(50, Math.abs(a2 - b2) * 0.6);
            
            ctrlPoint1.x = point1.x - distance;
            ctrlPoint1.y = point1.y;
            
            ctrlPoint2.x = point2.x - distance;
            ctrlPoint2.y = point2.y;
            
            fleche = 'droite';
            point_fleche = point1;
            point_fleche.x += 2;
        }
    }

    dbd.schema.context.beginPath();
    dbd.schema.context.strokeStyle = 'blue';
    dbd.schema.context.lineWidth = 2;
    dbd.schema.context.moveTo(point1.x, point1.y);
    dbd.schema.context.bezierCurveTo(ctrlPoint1.x, ctrlPoint1.y, ctrlPoint2.x, ctrlPoint2.y, point2.x, point2.y);
    dbd.schema.context.stroke();
    
    if(fleche == 'gauche')
    {
        dbd.schema.context.beginPath();
        dbd.schema.context.moveTo(point_fleche.x, point_fleche.y);
        dbd.schema.context.lineTo(point_fleche.x + 10, point_fleche.y + 4);
        dbd.schema.context.lineTo(point_fleche.x + 10, point_fleche.y - 4);
        dbd.schema.context.lineTo(point_fleche.x, point_fleche.y);
        dbd.schema.context.fill();
        dbd.schema.context.strokeStyle = 'blue';
        dbd.schema.context.stroke();
    }
    else if(fleche == 'droite')
    {
        dbd.schema.context.beginPath();
        dbd.schema.context.moveTo(point_fleche.x, point_fleche.y);
        dbd.schema.context.lineTo(point_fleche.x - 10, point_fleche.y + 4);
        dbd.schema.context.lineTo(point_fleche.x - 10, point_fleche.y - 4);
        dbd.schema.context.lineTo(point_fleche.x, point_fleche.y);
        dbd.schema.context.fill();
        dbd.schema.context.strokeStyle = 'blue';
        dbd.schema.context.stroke();
    }
}


dbd.objects.LinksContainer = function()
{

}

dbd.objects.LinksContainer.prototype = new dbd.objects.Container;

dbd.objects.LinksContainer.prototype.draw = function()
{
    dbd.schema.context.clearRect(0, 0, dbd.schema.canvas.width, dbd.schema.canvas.height);
    
    dbd.objects.Container.prototype.draw.apply(this);
}
