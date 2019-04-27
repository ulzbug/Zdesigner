
dbd.objects.Schema = function()
{
    this.id = null;
    this.name = '';
    this.type = 2;
    this.read_only = false;
    this.size ='auto';
    
    this.tables = new dbd.objects.Container();
    this.addChild(this.tables); 
    
    this.links = new dbd.objects.LinksContainer();
    this.addChild(this.links);
    
    this.initCanvas();
}

dbd.objects.Schema.prototype = new dbd.objects.Container;



dbd.objects.Schema.prototype.addNewTable = function()
{
    this.tables.addChild(new dbd.objects.Table());
    dbd.schema.autosave();
}

dbd.objects.Schema.prototype.clean = function()
{
    $('.dbd-table').remove();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

dbd.objects.Schema.prototype.draw = function()
{
    this.clean();
    
    dbd.objects.Container.prototype.draw.apply(this);
}

dbd.objects.Schema.prototype.save = function(no_notification)
{
    if(this.id == null)
    {
        this.saveas();
    }
    else
    {
        $.ajax('ajax/save_schema.php', 
        {
            dataType: 'json',
            data: JSON.stringify(this, function(key, value) {
                if(key == 'table' && typeof(value) == 'object') 
                {
                    return value.id; 
                }
                
                return value;  
            }),
            contentType: 'application/json',
            method: 'POST'
        }).done(function(ret, textStatus, jqXHR)
        {
            if(ret.updates)
            {
                for(var i = 0 ; i < ret.updates.length; i++)
                {
                    if(ret.updates[i].type == 'table')
                    {
                        var elt = dbd.schema.getTable(ret.updates[i].id);
                        $('#'+elt.id).remove();
                    }
                    else if(ret.updates[i].type == 'column')
                    {
                        var elt = dbd.schema.getColumn(ret.updates[i].id);
                        $('#'+elt.table.id).remove();
                    }
                    
                    for(var field in ret.updates[i].fields)
                    {
                        elt[field] = ret.updates[i].fields[field];
                    }
                    
                    if(ret.updates[i].type == 'table')
                    {
                        elt.draw();
                    }
                    else if(ret.updates[i].type == 'column')
                    {
                        elt.table.draw();
                    }
                }
            }
            if(document.title.substring(0, 2) == '* ')
            {
                document.title = document.title.substring(2);
            }
            
            if(document.location.href.indexOf('schema-') == -1)
            {
                document.location = 'schema-'+dbd.schema.id;
            }
            
            if(ret.notification && !no_notification)
            {
                var notification = new dbd.objects.Notification(ret.notification.icon, ret.notification.text, ret.notification.delay);
                notification.display();
            }
        });
    }
}
dbd.objects.Schema.prototype.autosave = function()
{
    if(this.id > 0 && dbd.config.autosave)
    {
        this.save(true);
    }
    else
    {
        if(document.title.substring(0, 1) != '*')
        {
            document.title = '* '+document.title;
        }
    }
}
dbd.objects.Schema.prototype.saveas = function()
{
    var window_save = new dbd.objects.Window(400, 200, 'Enregistrer sous ...');
    window_save.append('<form class="dbd_form">\
        <p>\
            <label for="schema_name">Nom du schéma : </label><input type="text" id="dbd_form_saveas_schema_name" />\
        </p>\
        <p>\
            <label for="schema_name">Type de schéma : </label>\
            <select id="dbd_form_saveas_schema_type"><option value="2">Mysql</option></select>\
        </p>\
    </form>'
    );
    
    var window_buttons = $('<div></div>');
    window_buttons.addClass("window_buttons");
    window_buttons.append(new dbd.objects.Button('Enregistrer', function()
    {
        dbd.schema.name = $('#dbd_form_saveas_schema_name').val();;
        dbd.schema.type = $('#dbd_form_saveas_schema_type').val();;
        
        dbd.schema.create();
        
        window_save.close(); 
    }, this, 'save'));
    window_buttons.append(' &nbsp; ');
    window_buttons.append(new dbd.objects.Button('Annuler', function()
    {
        window_save.close(); 
    }, this, 'cancel'));
    
    window_save.append(window_buttons);
    
    window_save.display();
    
    $('#dbd_form_saveas_schema_name').focus();
}

dbd.objects.Schema.prototype.new_schema = function()
{
    document.location = document.location.href.split('/').slice(0, -1).join('/');
}

dbd.objects.Schema.prototype.create = function()
{
    var schema = this;
    
    $.ajax('ajax/create_new_schema.php', 
    {
        dataType: 'json',
        data: 'name='+this.name+'&type='+this.type
    }).done(function(ret, textStatus, jqXHR){
        if(ret.data && ret.data.id)
        {
            schema.id = ret.data.id;
            schema.save(); 
        }
    });
}

dbd.objects.Schema.prototype.load = function(schema)
{
    this.id = schema.id;
    this.name = schema.name;
    this.type = schema.type;
    this.size = schema.size;
    this.read_only = schema.read_only == 1 ? true : false ;
    
    for(table in schema.tables)
    {
        var new_table = new dbd.objects.Table();
        new_table.load(schema.tables[table]);
        this.tables.addChild(new_table);
    }
}

dbd.objects.Schema.prototype.getTable = function(table_id)
{
    for(var i = 0; i < this.tables.children.length; i++)
    {
        var table = this.tables.children[i];
        if(table.id == table_id)
        {
            return table;
        }
    }
    return null;
}

dbd.objects.Schema.prototype.getColumn = function(column_id)
{
    for(var i = 0; i < this.tables.children.length; i++)
    {
        var table = this.tables.children[i];
        for(var j = 0; j < table.children.length; j++)
        {
            var column = table.children[j];
            if(column.id == column_id)
            {
                return column;
            }
        }
    }
    return null;
}

dbd.objects.Schema.prototype.getLink = function(column1, column2)
{
    for(var i = 0; i < this.links.children.length; i++)
    {
        var link = this.links.children[i];
        
        if(link.source == column1 && link.destination == column2)
        {
            return link;
        }
    }
    return null;
}

dbd.objects.Schema.prototype.initCanvas = function()
{
    this.canvas = document.getElementById('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext('2d');
    
    $(window).resize(function(){
        dbd.schema.canvas.width = window.innerWidth;
        dbd.schema.canvas.height = window.innerHeight;
        dbd.schema.links.draw();
    });
}

dbd.objects.Schema.prototype.display_settings = function()
{
	var window_parameters = new dbd.objects.Window(400, 300, 'Paramètres de '+this.name);
	var form = $('<form class="dbd_form"></form>');
	form.append(new dbd.objects.Form.inputText('dbd_form_schema_name', 'Nom du schéma', this.name));
	form.append(new dbd.objects.Form.inputText('dbd_form_schema_size', 'Taille de la zone d\'édition', this.size));
	form.append(new dbd.objects.Form.checkBoxLeft('dbd_form_schema_read_only', 'Lecture seule', this.read_only));
	
	window_parameters.append(form);
	
	var window_buttons = $('<div></div>');
	window_buttons.addClass("window_buttons");

    window_buttons.append(new dbd.objects.Button('Enregistrer', function()
    {
		// Changement du status de read only : on redessine toutes les tables
		if( this.read_only && !$('#dbd_form_schema_read_only').is(':checked') || !this.read_only && $('#dbd_form_schema_read_only').is(':checked'))
		{
			this.read_only = $('#dbd_form_schema_read_only').is(':checked');
			this.tables.draw();
		}
        
		this.size = $('#dbd_form_schema_size').val();
		this.name = $('#dbd_form_schema_name').val();
		
		this.update_size();
		this.update_page_title();
		
		this.autosave();
		
		window_parameters.close();
		
    }, this, 'save'));
	
	window_parameters.append(window_buttons);
    
    window_parameters.display();
}

dbd.objects.Schema.prototype.display_export_sql = function()
{
	var export_sql = '';
    for(var i = 0; i < this.tables.children.length; i++)
    {
        export_sql += this.tables.children[i].export_sql();
    }
	
	var window_export_sql = new dbd.objects.Window(800, window.innerHeight - 150, 'Export SQL de '+this.name);
	
	var textarea = $('<textarea id="export_sql" readonly="readonly" style="background-color:#EEEEEE;">'+export_sql+'</textarea>');
	textarea.css('width', '100%').css('height', window.innerHeight - 220);

	window_export_sql.append(textarea);
    
    window_export_sql.display();
	
	textarea.focus().select();
}

dbd.objects.Schema.prototype.update_page_title = function()
{
	if(document.title.substring(0, 1) != '*')
	{
		document.title = '* Zdesigner - '+this.name;
	}
	else
	{
		document.title = 'Zdesigner - '+this.name;
	}
}

dbd.objects.Schema.prototype.update_size = function()
{
	
	var size_regex = /^(\d+)x(\d+)$/;
	var sizes;
	if(this.size != 'auto' && (sizes = this.size.match(size_regex)))
	{
		this.width = sizes[1];
		this.height = sizes[2];
	}
	else
	{
		this.size = 'auto';
		
		var max_right = 0;
		var max_bottom = 0;
		for(var i = 0; i < this.tables.children.length; i++)
		{
			var table = this.tables.children[i];
			
			var right = table.position.x + $('#'+table.id).width();
			if(right > max_right)
			{
				max_right = right;
			}
			
			var bottom = table.position.y + $('#'+table.id).height();
			if(bottom > max_bottom)
			{
				max_bottom = bottom;
			}
		}
		this.width = max_right + 100;
		this.height = max_bottom + 100;
	}
	
	if(this.width < window.innerWidth)			this.width = window.innerWidth;
	if(this.height < window.innerHeight)		this.height = window.innerHeight;
	
	dbd.schema.canvas.width = this.width;
	dbd.schema.canvas.height = this.height;	
    
    $('#canvas').width(this.width);
    $('#canvas').height(this.height);
    
    $('#canvas-grid').width(this.width);
	$('#canvas-grid').height(this.height);
    
    this.links.draw();
}



