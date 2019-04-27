
dbd.objects.Notification = function Notification(icon, text, delay)
{
    this.NotificationIcon = icon;
    this.NotificationText = text;
    
    if(!delay)
    {
        this.Notificationdelay = 5000;
    }
    else
    {
        this.Notificationdelay = delay;
    }
}

dbd.objects.Notification.prototype.display = function()
{
    $('#notification').remove();
    
    $.extend(this, $('<div class="notification" id="notification"></div>'));
    
    var notification = this;
    
    this.append(new dbd.objects.Icon(this.NotificationIcon));
    this.append(this.NotificationText);
    this.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    var closeButton = new dbd.objects.Icon('close_notification');
    closeButton.click(function()
    {
        notification.close();
    });
    this.append(closeButton);
    
    $('body').append(this);
    this.slideDown({ duration : 1000 });
    $('nav').animate({'margin-top' : 30 }, 1000);

    setTimeout(this.close, this.Notificationdelay);
}

dbd.objects.Notification.prototype.close = function()
{
    $('#notification').slideUp({ 
        duration : 1000, 
        done: function()
        { 
            $('#notification').remove(); 
        } 
    });
    $('nav').animate({'margin-top' : 0 }, 1000);    
}

