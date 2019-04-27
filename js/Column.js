
dbd.objects.Column = function Column()
{
    this.create();
}

dbd.objects.Column.prototype = new dbd.objects.Renderable;

dbd.objects.Column.prototype.create = function()
{
    this.name = "";    
    this.type = 1;    
    this.size = "";    
    this.primary_key = false;    
    this.default_value = "";    
    this.allow_null = false;    
    this.attributes = '';    
    this.auto_increment = false;    
    this.foreign_key = false; 
    this.comment = ''; 
    this.table = null;

    this.id = 'column-new-1';    
    var i = 1;
    while(utils.id_exists(this.id))
    {
        i++;
        this.id = 'column-new-'+i;
    }
}

dbd.objects.Column.prototype.draw = function()
{
    if(utils.id_exists(this.id))
    {
        $('#'+this.id).remove();
    }
    
    var current_column = this;
    
    var line = $("<tr></tr>");
    line.addClass("dbd-column");
    line.attr('id', this.id);
    line.attr('title', this.comment);
    
    if(this.primary_key > 0)
    {
        line.append($('<td></td>').append(new dbd.objects.Icon('primary_key')));
    }
    else
    {
        line.append('<td></td>');
    }
    line.append('<td>'+this.name+'</td>');
	
	var field_type = statics.schemas_types[dbd.schema.type].columns_type[this.type].column_type_name+(this.size ? ' ('+this.size+')' : '');
	if(field_type.length > 30)
	{
		line.append('<td title="'+field_type+'">'+statics.schemas_types[dbd.schema.type].columns_type[this.type].column_type_name+(this.size ? ' ('+this.size.substring(0, 15)+'...'+')' : '')+'</td>');
	}
	else
	{
		line.append('<td>'+field_type+'</td>');
	}
    
    if(!dbd.schema.read_only)
    {
        line.addClass('.sortable');
        
        var cell_action = $('<td></td>');
        var update_icon = new dbd.objects.Icon('update_column');
        update_icon.click(function()
        {
			if($('#update-column-form-'+current_column.id).length == 0)
			{
				line.after($('<tr></tr>').append($('<td colspan="4"></td>').append(current_column.display_form_update_column())));
			}
			else
			{
				$('#update-column-form-'+current_column.id).parent().parent().remove();
			}
        });
        cell_action.append(update_icon);
        
        var delete_icon = new dbd.objects.Icon('delete_column');
        delete_icon.click(function()
        {
            current_column.table.removeChild(current_column);
            current_column.table.draw();
            delete current_column;
            
            dbd.schema.autosave();
        });
        cell_action.append(delete_icon);
    }
    
    line.append(cell_action);
    
    return line;
}

dbd.objects.Column.prototype.load = function(column)
{
    this.id = 'column-'+column.id;
    this.name = column.name;
    this.type = column.type;
    this.size = column.size;
    this.primary_key = (column.primary_key > 0 ? true : false );
    this.default_value = column.default_value; 
    this.allow_null = (column.allow_null > 0 ? true : false );
    this.auto_increment = (column.auto_increment > 0 ? true : false );
    this.attributes = column.attributes;
    this.comment = column.comment;
    if(column.foreign_key > 0)
    {
        this.foreign_key = 'column-'+column.foreign_key;
        dbd.schema.links.addChild(new dbd.objects.Link(this.id, this.foreign_key));
    }
}

dbd.objects.Column.prototype.display_form_update_column = function()
{
    var current_column = this;
    
    this.table.setOnTop();
    
    var add_column_form = $('<div></div>');
    add_column_form.addClass('dbd-table-update-column-form');
    add_column_form.attr('id', 'update-column-form-'+this.id);
    
    // Name
    add_column_form.append(new dbd.objects.Form.inputText('update_column_name_'+this.id, 'Nom', this.name));
    
    // Type
    var type = new dbd.objects.Form.FormElt('update_column_type_'+this.id, 'Type');
    var select = $('<select id="update_column_type_'+this.id+'"></select>')
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
            optgroup.append($('<option value="'+value+'" '+(value == this.type? 'selected="selected"': '')+'>'+columns_type[value]['column_type_name']+'</option>'));
        }
        select.append(optgroup);
    }
    type.append(select);
    add_column_form.append(type);
    
    // Size
    add_column_form.append(new dbd.objects.Form.inputText('update_column_size_'+this.id, 'Taille', this.size));   

	// Attributes
	var attributes = new dbd.objects.Form.FormElt('update_column_attributes_'+this.id, 'Attributs');
	var select = $('<select id="update_column_attributes_'+this.id+'"></select>');
	select.append($('<option value=""></option>'));
	select.append($('<option value="UNSIGNED" '+(this.attributes == 'UNSIGNED'? 'selected="selected"': '')+'>UNSIGNED</option>'));
	select.append($('<option value="UNSIGNED ZEROFILL" '+(this.attributes == 'UNSIGNED ZEROFILL'? 'selected="selected"': '')+'>UNSIGNED ZEROFILL</option>'));
	select.append($('<option value="BINARY" '+(this.attributes == 'BINARY'? 'selected="selected"': '')+'>BINARY</option>'));
	attributes.append(select);
    add_column_form.append(attributes);
    
    // Default value
    add_column_form.append(new dbd.objects.Form.inputText('update_column_default_'+this.id, 'Par défaut', this.default_value));    
    
    // Primary key
    add_column_form.append(new dbd.objects.Form.checkBox('update_column_primary_'+this.id, 'Clé primaire', this.primary_key));    
    
    // Allow null
    add_column_form.append(new dbd.objects.Form.checkBox('update_column_allow_null_'+this.id, 'Autor. null', this.allow_null));    
	
    // Auto increment
    add_column_form.append(new dbd.objects.Form.checkBox('update_column_auto_increment_'+this.id, 'Auto incrément', this.auto_increment));    
    
    // Foreign key
    var foreign_key = new dbd.objects.Form.checkBox('update_column_foreign_key_'+this.id, 'Clé étrangère', this.foreign_key);
    foreign_key.click(function()
    {
        if($(this).find('input').is(':checked'))
        {
            $('#foreign_key_form_'+current_column.id).show();
        }
        else
        {
            $('#foreign_key_form_'+current_column.id).hide();
        }
    });
    add_column_form.append(foreign_key);
    
    var foreign_key_form = $('<div></div>');
    foreign_key_form.attr('id', 'foreign_key_form_'+this.id);
    if(this.foreign_key == 0)
    {
        foreign_key_form.css('display', 'none');
        foreign_key_form.append(new dbd.objects.Form.select('foreign_key_form_tables_'+this.id, 'Table', dbd.schema.tables.children));
        foreign_key_form.append(new dbd.objects.Form.select('foreign_key_form_columns_'+this.id, 'Colonne', dbd.schema.tables.children[0].children));
    }
    else
    {
        var foreign_key_column = dbd.schema.getColumn(this.foreign_key);
        foreign_key_form.append(new dbd.objects.Form.select('foreign_key_form_tables_'+this.id, 'Table', dbd.schema.tables.children, foreign_key_column.table.id));
        foreign_key_form.append(new dbd.objects.Form.select('foreign_key_form_columns_'+this.id, 'Colonne', foreign_key_column.table.children, foreign_key_column.id));
    }

    foreign_key_form.find('#foreign_key_form_tables_'+this.id).change(function()
    {
        var new_select = new dbd.objects.Form.select('foreign_key_form_columns_'+current_column.id, 'Colonne', dbd.schema.getTable($(this).val()).children);
        
        $('#foreign_key_form_columns_'+current_column.id).parent().parent().append(new_select);
        $('#foreign_key_form_columns_'+current_column.id).parent().remove();
    });
    add_column_form.append(foreign_key_form);
    
    add_column_form.append(new dbd.objects.Form.textarea('update_column_comment_'+this.id, 'Commentaire', this.comment));
    
    var buttons_div = $('<div></div>');
    buttons_div.addClass('window_buttons');
    
    buttons_div.append(new dbd.objects.Button('Update', function()
    {
        this.table.removeOnTop();
        
        this.name = $('#update_column_name_'+this.id).val();
        this.type = $('#update_column_type_'+this.id).val();
        this.size = $('#update_column_size_'+this.id).val();
        this.default_value = $('#update_column_default_'+this.id).val();
        this.attributes = $('#update_column_attributes_'+this.id).val();
        
        if(this.foreign_key)
        {
            dbd.schema.links.removeChild(dbd.schema.getLink(this.id, this.foreign_key));
        }
        if($('#update_column_foreign_key_'+this.id).is(':checked'))
        {
            this.foreign_key = $('#foreign_key_form_columns_'+this.id).val();
            dbd.schema.links.addChild(new dbd.objects.Link(this.id, this.foreign_key));
        }
        else
        {
            this.foreign_key = 0;
        }
        if($('#update_column_primary_'+this.id).is(':checked'))
        {
            this.primary_key = true;
        }
        else
        {
            this.primary_key = false;
        }
        if($('#update_column_allow_null_'+this.id).is(':checked'))
        {
            this.allow_null = true;
        }
        else
        {
            this.allow_null = false;
        }
        if($('#update_column_auto_increment_'+this.id).is(':checked'))
        {
            this.auto_increment = true;
        }
        else
        {
            this.auto_increment = false;
        }
        this.comment = $('#update_column_comment_'+this.id).val();
        
        this.table.draw();
        dbd.schema.links.draw();
        
        dbd.schema.autosave();
        
    }, this));  

    buttons_div.append('&nbsp;&nbsp;&nbsp;');
    
    buttons_div.append(new dbd.objects.Button('Annuler', function()
    {
        $('#update-column-form-'+this.id).parent().parent().remove();
        this.table.removeOnTop();
    }, this));
    add_column_form.append(buttons_div);
    
    
    return add_column_form;
}

dbd.objects.Column.prototype.export_sql = function()
{
    var export_sql = '`'+this.name+'` '+statics.schemas_types[dbd.schema.type].columns_type[this.type].column_type_name.toUpperCase() +(this.size ? ' ('+this.size+')' : '');
	
	export_sql += (this.attributes ? ' '+this.attributes+' ' : '');
	
	export_sql += (this.allow_null ? '' : ' NOT NULL ');
	
	export_sql += (this.auto_increment ? ' AUTO_INCREMENT ' : '');
	
	export_sql += (this.comment ? "  COMMENT '"+this.comment.replace("'", "''")+"'" : "");
	
	return export_sql;
}
