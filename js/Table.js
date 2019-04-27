
dbd.objects.Table = function Table()
{
    this.create();
}

dbd.objects.Table.prototype = new dbd.objects.Container;

dbd.objects.Table.prototype.create = function()
{
    this.name = "Table sans nom";    
    this.position = {x : 50, y : 50};
    this.comment = '';

    this.id = 'table-new-1';    
    var i = 1;
    while(utils.id_exists(this.id))
    {
        i++;
        this.id = 'table-new-'+i;
    }
    this.children = new Array();
}

dbd.objects.Table.prototype.draw = function()
{
    if(utils.id_exists(this.id))
    {
        $('#'+this.id).remove();
    }
    
    var this_table = this;
    
    var table = $("<div></div>");
    table.addClass("dbd-table");
    table.css('left', this.position.x+'px');
    table.css('top', this.position.y+'px');
    table.attr('id', this.id);
    
    var title = this.display_title();
    table.append(title);

    table.append(this.display_form_edit_title());
    
    if(this.children.length > 0)
    {
        var table_columns = this.display_table_columns();
        table.append(table_columns);
    }
    if(!dbd.schema.read_only)
    {
        table.append(this.display_add_column());

        table.append(this.display_form_add_column());
    }
    
    $('#canvas-grid').append(table);
    
    if(!dbd.schema.read_only)
    {
        table.draggable({ 
            handle: title,
            start : this.start_drag,
            stop : (function(table){
                return function(){ table.stop_drag(); };
            })(this)
        });
        
        var fixHelper = function(e, ui) {
            ui.children().each(function() {
                $(this).width($(this).width() + 1);
            });
            return ui;
        };
        
        $('#dbd-table-columns-'+this.id+' tbody').sortable({
            containment: "parent",
            helper:fixHelper,
            stop : function( event, ui ) {
                var children = $('#dbd-table-columns-'+this_table.id+' tbody').children();

                var new_columns = new Array();
                for(var i = 0; i < children.length; i++)
                {
                    new_columns.push(dbd.schema.getColumn(children[i].id));
                }        
                this_table.children = new_columns;
                
                dbd.schema.autosave();
            }
        }).disableSelection();
    }
}

dbd.objects.Table.prototype.start_drag = function()
{
    dbd.schema.context.clearRect(0, 0, dbd.schema.canvas.width, dbd.schema.canvas.height);
}

dbd.objects.Table.prototype.stop_drag = function()
{
    this.position.x = $('#'+this.id).position().left;
    this.position.y = $('#'+this.id).position().top;
    
    if(dbd.config.alignOnGrid)
    {
        this.position.x = Math.round(this.position.x / 10) * 10 + 1;
        this.position.y = Math.round(this.position.y / 10) * 10 + 1;
        
        this.draw();
    }
    
    dbd.schema.autosave();
    
    dbd.schema.update_size();
    
    dbd.schema.links.draw();
}

dbd.objects.Table.prototype.display_title = function()
{
    var title = $('<div></div>');
    title.html(this.name);
    title.attr('id', 'title-table-'+this.id);
    title.addClass('dbd-table-title');
    
    if(!dbd.schema.read_only)
    {
        title.addClass('draggable');
        
        var this_table = this;
        var icon_edit = $('<img src="images/table-edit.png" alt="Table edit" />');
        icon_edit.css('float', 'right');
        icon_edit.css('margin-top', '6px')
        icon_edit.addClass('dbd-icon');
        icon_edit.click(function()
        {
            $('#edit_table_'+this_table.id).parent().show();
            $('#title-table-'+this_table.id).hide();
            this_table.setOnTop();
            
        });
        title.append(icon_edit);
    }
    return title;
}
dbd.objects.Table.prototype.display_form_edit_title = function()
{
    var this_table = this;
    
    var title_edit = $('<div></div>');
    title_edit.addClass("dbd-table-title-edit");
    
    title_edit.append('<input type="text" id="edit_table_'+this.id+'" value="'+this.name+'" />');

    var window_buttons = $('<div></div>');
    window_buttons.addClass("window_buttons");
    
    var button_ok = new dbd.objects.Button('Sauver', function()
    {
        this.name = $('#edit_table_'+this.id).val();
        this.draw();
        dbd.schema.autosave();
        this.removeOnTop();
    }, this, 'save');
    window_buttons.append(button_ok);
    
    window_buttons.append(' &nbsp; '); 
    
    var button_cancel= new dbd.objects.Button('Annuler', function()
    {
        $('#edit_table_'+this_table.id).parent().hide();
        $('#title-table-'+this_table.id).show();
        this.removeOnTop();
    }, this, 'cancel');
    window_buttons.append(button_cancel);    
    
    title_edit.append(window_buttons);
    title_edit.append('<br />');
    
    var window_buttons = $('<div></div>');
    window_buttons.addClass("window_buttons")
  
    var button_delete= new dbd.objects.Button('Supprimer la table', function()
    {
        dbd.schema.tables.removeChild(this);
        $('#'+this.id).remove();
        dbd.schema.autosave();
        this.removeOnTop();
        
    }, this, 'delete');
    window_buttons.append(button_delete);
    title_edit.append(window_buttons);
    
    return title_edit;
}

dbd.objects.Table.prototype.display_table_columns = function()
{
    var sql_fields = $('<table></table>');
    sql_fields.addClass('dbd-table-columns');
    sql_fields.attr('id', 'dbd-table-columns-'+this.id);
    for(var i = 0; i < this.children.length; i++)
    {
		if(this.children[i])
		{
			var line = this.children[i].draw();
			sql_fields.append(line);
		}
    }
    
    var container_column_table = $('<div></div>');
    container_column_table.append(sql_fields);
    container_column_table.css('overflow', 'hidden');
    container_column_table.css('position', 'relative');
    container_column_table.css('border-bottom', '1px solid black');
    
    return container_column_table;
}

dbd.objects.Table.prototype.display_add_column = function()
{
    var this_table = this;
    
    var icon_add = new dbd.objects.Icon('add-column');
    icon_add.css('margin-bottom', '0px').css('margin-top', '0px');
    var add_field = $('<div class="link_action"></div>').append(icon_add).append('<span style="vertical-align:top">Ajouter une colonne</span>');
    add_field.attr('id', 'add-column-button-'+this.id);
    add_field.click(function()
    {
        this_table.setOnTop();
        $('#add-column-button-'+this_table.id).hide();
        $('#add-column-form-'+this_table.id).show();
    });
    
    return add_field;
}

dbd.objects.Table.prototype.display_form_add_column = function()
{
    var this_table = this;
    
    var add_column_form = $('<div></div>');
    add_column_form.addClass('dbd-table-add-column-form');
    add_column_form.attr('id', 'add-column-form-'+this.id);
    
    // Name
    add_column_form.append(new dbd.objects.Form.inputText('new_column_name_'+this.id, 'Nom', ''));
    
    // Type
    var type = new dbd.objects.Form.FormElt('new_column_type_'+this.id, 'Type');
    var select = $('<select id="new_column_type_'+this.id+'"></select>')
    var top_columns = statics.schemas_types[dbd.schema.type].columns_top;
    var columns_type = statics.schemas_types[dbd.schema.type].columns_type;
    var columns_group = statics.schemas_types[dbd.schema.type].columns_group;
    for( var i = 0; i < top_columns.length; i++)
    {
        select.append($('<option value="'+top_columns[i]+'">'+columns_type[top_columns[i]]['column_type_name']+'</option>'));
    }
    for(var group in columns_group)
    {
        var optgroup = $('<optgroup label="'+columns_group[group].group_name+'"></optgroup>')
        for( var i = 0; i < columns_group[group].columns_types.length; i++)
        {
            value = columns_group[group].columns_types[i];
            optgroup.append($('<option value="'+value+'">'+columns_type[value]['column_type_name']+'</option>'));
        }
        select.append(optgroup);
    }
    type.append(select);
    add_column_form.append(type);
    
    // Size
    add_column_form.append(new dbd.objects.Form.inputText('new_column_size_'+this.id, 'Taille', ''));      
    
    // Default value
    add_column_form.append(new dbd.objects.Form.inputText('new_column_default_'+this.id, 'Par défaut', ''));    
    
    // Primary key
    add_column_form.append(new dbd.objects.Form.checkBox('new_column_primary_'+this.id, 'Clé primaire', false));    
    
    // Allow null
    add_column_form.append(new dbd.objects.Form.checkBox('new_column_allow_null_'+this.id, 'Autor. null', false));    
    
    // Foreign key
    var foreign_key = new dbd.objects.Form.checkBox('new_column_foreign_key_'+this.id, 'Clé étrangère', false);
    foreign_key.click(function()
    {
        if($(this).find('input').is(':checked'))
        {
            $('#foreign_key_form_'+this_table.id).show();
        }
        else
        {
            $('#foreign_key_form_'+this_table.id).hide();
        }
    });
    add_column_form.append(foreign_key);
    
    var foreign_key_form = $('<div></div>');
    foreign_key_form.attr('id', 'foreign_key_form_'+this.id);
    foreign_key_form.css('display', 'none');
    foreign_key_form.append(new dbd.objects.Form.select('foreign_key_form_tables_'+this.id, 'Table', dbd.schema.tables.children));
    foreign_key_form.append(new dbd.objects.Form.select('foreign_key_form_columns_'+this.id, 'Colonne', dbd.schema.tables.children[0].children));
    foreign_key_form.find('#foreign_key_form_tables_'+this.id).change(function()
    {
        var new_select = new dbd.objects.Form.select('foreign_key_form_columns_'+this_table.id, 'Colonne', dbd.schema.getTable($(this).val()).children);
        
        $('#foreign_key_form_columns_'+this_table.id).parent().parent().append(new_select);
        $('#foreign_key_form_columns_'+this_table.id).parent().remove();
    });
    add_column_form.append(foreign_key_form);
    
    add_column_form.append(new dbd.objects.Form.textarea('new_column_comment_'+this.id, 'Commentaire', this.comment));
    
    var buttons_div = $('<div></div>');
    buttons_div.addClass('window_buttons');
    
    buttons_div.append(new dbd.objects.Button('Ajouter', function()
    {
        var new_column = new dbd.objects.Column();
        new_column.name = $('#new_column_name_'+this.id).val();
        new_column.type = $('#new_column_type_'+this.id).val();
        new_column.size = $('#new_column_size_'+this.id).val();
        new_column.default_value = $('#new_column_default_'+this.id).val();
        new_column.table = this;
        if($('#new_column_foreign_key_'+this.id).is(':checked'))
        {
            new_column.foreign_key = $('#foreign_key_form_columns_'+this.id).val();
        }
        if($('#new_column_primary_'+this.id).is(':checked'))
        {
            new_column.primary_key = true;
        }
        if($('#new_column_allow_null_'+this.id).is(':checked'))
        {
            new_column.allow_null = true;
        }
        new_column.comment = $('#new_column_comment_'+this.id).val();
        
        this.addChild(new_column);
        
        this.draw();
        
        dbd.schema.autosave();
        
        this.removeOnTop();
        
    }, this, 'add'));  

    buttons_div.append('&nbsp;&nbsp;&nbsp;');
    
    buttons_div.append(new dbd.objects.Button('Annuler', function()
    {
        $('#add-column-button-'+this.id).show();
        $('#add-column-form-'+this.id).hide();
        this.removeOnTop();
    }, this, 'cancel'));
    add_column_form.append(buttons_div);
    
    
    return add_column_form;
}

dbd.objects.Table.prototype.load = function(table)
{
    this.id = 'table-'+table.id;
    this.name = table.name;    
    this.position = {x : parseInt(table.pos_x), y : parseInt(table.pos_y)};
    
    for(column in table.columns)
    {
        var new_column = new dbd.objects.Column();
        new_column.load(table.columns[column]);
        new_column.table = this;
        this.addChild(new_column);
    }
}

dbd.objects.Table.prototype.setOnTop = function()
{
    $('#'+this.id).css('zIndex', 15);
}

dbd.objects.Table.prototype.removeOnTop = function()
{
    $('#'+this.id).css('zIndex', 10);
}

dbd.objects.Table.prototype.export_sql = function()
{
    var export_sql = 'CREATE TABLE IF NOT EXISTS  `'+this.name+'` ('+"\n";
	
	var primary_keys = new Array();
    for(var i = 0; i < this.children.length; i++)
    {
        export_sql += this.children[i].export_sql();
		if(i < this.children.length - 1)
		{
			export_sql += ',';
		}
		export_sql += "\n";
		
		if(this.children[i].primary_key)
		{
			primary_keys.push('`'+this.children[i].name+'`');
		}
    }
	
	if(primary_keys.length > 0)
	{
		export_sql += ', PRIMARY KEY (' + primary_keys.join(',') + ') ';
	}
		
	export_sql += ' ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;'+"\n\n";
	
	return export_sql;
}
