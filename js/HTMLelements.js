
dbd.objects.Window = function (width, height, title)
{
    $('.dbd-window').remove();
    
    $.extend(this, $("<div></div>"));
    this.addClass("dbd-window");
    this.css('width', width);
    this.css('height', height);
    this.css('left', ($(window).width() - width) / 2);
    this.css('top', ($(window).height() - height) / 2);
    
    var window_title = $('<div class="window_title"></div>');
    window_title.append(title);
    var button_close = new dbd.objects.Icon('close');
    button_close.click(function(window)
    {
        return function()
        {
            window.close();
        }
    }(this));
    window_title.append(button_close);
    this.append(window_title);
    
    this.window_content = $('<div class="window_content"></div>');
    this.append(this.window_content);
    
    this.append = function(elt)
    {
        this.window_content.append(elt);
    }
    
    return this;
}

dbd.objects.Window.prototype.addButton = function(name, action)
{
    var button = dbd.objects.Button(name, action, this);
    this.append(button);
}

dbd.objects.Window.prototype.addCloseButton = function(name)
{
    this.addButton(name, function()
    {
        $('#fond-flou').hide();
        this.remove();
    });
}

dbd.objects.Window.prototype.close = function()
{
    $('#fond-flou').hide();
    this.remove();
}

dbd.objects.Window.prototype.display = function()
{
    if(utils.id_exists('fond-flou'))
    {
        $('#fond-flou').show();
    }
    else
    {
        var flou = $("<div></div>");
        flou.attr('id', 'fond-flou');
        $("body").append(flou);
    }
    
    $("body").append(this);
}



dbd.objects.Icon = function (name)
{
    $.extend(this, $('<img src="images/'+name+'.png" />'));
    this.addClass('dbd-icon');
    
    return this;
}

dbd.objects.Button = function (name, click, target, icon)
{
    $.extend(this, $('<button>'+name+'</button>'));
    if(icon)
    {
        this.prepend(dbd.objects.Icon(icon));
    }
    if(target)
    {
        this.click((function(target)
        {
            return function()
            {
                click.apply(target);
            }
        })(target));
    }
    else
    {
        this.click(click);
    }
    
    return this;
}

dbd.objects.Form = {};

dbd.objects.Form.FormElt = function (id, name)
{
    $.extend(this, $('<p></p>'));
    
    this.append('<label for="'+id+'">'+name+'</label>');
    
    return this;
}

dbd.objects.Form.inputText = function (id, name, value)
{
    $.extend(this, new dbd.objects.Form.FormElt(id, name));
    
    this.append('<input type="text" name="'+id+'"  id="'+id+'" value="'+value+'">');
    
    return this;
}

dbd.objects.Form.inputPassword = function (id, name, value)
{
    $.extend(this, new dbd.objects.Form.FormElt(id, name));
    
    this.append('<input type="password" name="'+id+'"  id="'+id+'" value="'+value+'">');
    
    return this;
}

dbd.objects.Form.checkBox = function (id, name, checked)
{
    $.extend(this, new dbd.objects.Form.FormElt(id, name));
    
    this.append('<input type="checkbox" name="'+id+'"  id="'+id+'" '+(checked ? 'checked="checked"' : '')+'>');
    
    return this;
}

dbd.objects.Form.checkBoxLeft = function (id, name, checked)
{
    $.extend(this, $('<p></p>'));
    
    this.append('<input type="checkbox" name="'+id+'"  id="'+id+'" '+(checked ? 'checked="checked"' : '')+'> &nbsp; '+name);
    
    return this;
}

dbd.objects.Form.select = function (id, name, values, valueSelected, emptyValue)
{
    $.extend(this, new dbd.objects.Form.FormElt(id, name));
    
    var select = $('<select name="'+id+'" id="'+id+'"></select>');
    if(emptyValue)
    {
        select.append($('<option value="0"> - </option>'));
    }
    var id, name;
    for(var i = 0; i < values.length; i++)
    {
        select.append($('<option value="'+values[i].id+'" '+(values[i].id==valueSelected?'selected="selected"':'')+'>'+values[i].name+'</option>'));
    }
    
    this.append(select);
    
    return this;
}

dbd.objects.Form.chooseMultipleElements = function (id, name, values)
{
	function left_to_right(e)
	{
		e.preventDefault();
		
		$('#'+id).find(':selected').each(function()
		{
			$('#'+id+'_selected').append($(this));
			$(this).attr('selected', false);
		});
		$('#'+id).find(':selected').remove();
	}
	function right_to_left(e)
	{
		e.preventDefault();
		
		$('#'+id+'_selected').find(':selected').each(function()
		{
			$('#'+id).append($(this));
			$(this).attr('selected', false);
		});
		$('#'+id+'_selected').find(':selected').remove();
	}
	function all_left_to_right(e)
	{
		e.preventDefault();
		
		$('#'+id).children().each(function()
		{
			$('#'+id+'_selected').append($(this));
			$(this).attr('selected', false);
		});
		$('#'+id).children().remove();
	}
	function all_right_to_left(e)
	{
		e.preventDefault();
		
		$('#'+id+'_selected').children().each(function()
		{
			$('#'+id).append($(this));
			$(this).attr('selected', false);
		});
		$('#'+id+'_selected').children().remove();
	}
	
    $.extend(this, new dbd.objects.Form.FormElt(id, name));
	var divChooseMultipleElements = $('<div style="display:flex;"></div>');
    
    var select = $('<select name="'+id+'" id="'+id+'" multiple="multiple" style="width:400px; height:150px;"></select>');
    var id, name;
    for(var i = 0; i < values.length; i++)
    {
        select.append($('<option value="'+values[i].id+'">'+values[i].name+'</option>'));
    }
    divChooseMultipleElements.append(select);
	
	var div_buttons = $('<div style="text-align:center; padding:20px 7px;"></div>');
	var button_left_to_right = new dbd.objects.Button('>', left_to_right);
	div_buttons.append(button_left_to_right);	
	div_buttons.append('<br />');	
	var button_right_to_left = new dbd.objects.Button('<', right_to_left);
	div_buttons.append(button_right_to_left);	
	div_buttons.append('<br />');	
	var button_all_left_to_right = new dbd.objects.Button('>>', all_left_to_right);
	div_buttons.append(button_all_left_to_right);	
	div_buttons.append('<br />');	
	var button_all_right_to_left = new dbd.objects.Button('<<', all_right_to_left);
	div_buttons.append(button_all_right_to_left);
	div_buttons.append('<br />');	
	
	divChooseMultipleElements.append(div_buttons);
	
    var select = $('<select name="'+id+'_selected" id="'+id+'_selected" multiple="multiple" style="width:400px; height:150px"></select>');
    divChooseMultipleElements.append(select);
    
	this.append(divChooseMultipleElements);
	
    return this;
}

dbd.objects.Form.textarea = function (id, name, value)
{
    $.extend(this, new dbd.objects.Form.FormElt(id, name));
    
    this.append('<br /><br /><textarea name="'+id+'"  id="'+id+'">'+(value?value:'')+'</textarea>');
    
    return this;
}

