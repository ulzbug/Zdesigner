
dbd.objects.Container = function Container()
{
    this.children = new Array();
}

dbd.objects.Container.prototype = new dbd.objects.Renderable;

dbd.objects.Container.prototype.draw = function()
{
    for(var i = 0; i < this.children.length; i++)
    {
        this.children[i].draw();
    }
}

dbd.objects.Container.prototype.addChild = function(child)
{
    this.children.push(child);
}

dbd.objects.Container.prototype.removeChild = function(child)
{
    this.children.splice( this.getChildIndex(child), 1 );
}

dbd.objects.Container.prototype.getChildIndex = function(child) {
    return this.children.indexOf( child );
}



