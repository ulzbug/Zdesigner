
dbd.objects.Connexion = function Connexion(id, name, database, host, login, password, port)
{
    this.id = id;
    this.name = name;
    this.database = database;
    this.host = host;
    this.login = login;
    this.password = password;
    this.port = port;
}
var window_new_connexion;
dbd.objects.Connexion.display_form_new_connexion = function()
{
    window_new_connexion = new dbd.objects.Window(500, 350, 'Nouvelle connexion');
    var form = $('<form class="dbd_form"></form>');
    form.append(new dbd.objects.Form.inputText('dbd_form_new_connexion_name', 'Nom de la connexion', 'Nouvelle connexion'));
    form.append(new dbd.objects.Form.select('dbd_form_new_connexion_db', 'Base de données', [{'id' : 'mysql', 'name' : 'MySQL'}]));
    form.append(new dbd.objects.Form.inputText('dbd_form_new_connexion_server', 'Serveur', ''));
    form.append(new dbd.objects.Form.inputText('dbd_form_new_connexion_login', 'Login', ''));
    form.append(new dbd.objects.Form.inputPassword('dbd_form_new_connexion_password', 'Mot de passe', ''));
    form.append(new dbd.objects.Form.inputText('dbd_form_new_connexion_port', 'Port', ''));
    form.append(new dbd.objects.Form.checkBoxLeft('dbd_form_new_connexion_save_password', 'Enregistrer le mot de passe en clair', ''));

    window_new_connexion.append(form);
    
    var window_buttons = $('<div></div>');
    window_buttons.addClass("window_buttons");
    window_buttons.append(new dbd.objects.Button('Tester la connexion', function()
    {
        var name = $('#dbd_form_new_connexion_name').val();
        var database = $('#dbd_form_new_connexion_db').val();
        var host = $('#dbd_form_new_connexion_server').val();
        var login = $('#dbd_form_new_connexion_login').val();
        var password = $('#dbd_form_new_connexion_password').val();
        var port = $('#dbd_form_new_connexion_port').val();
        
        var connexion = new dbd.objects.Connexion(0, name, database, host, login, password, port);
        connexion.test();

    }, null, 'test-connexion')); 
    window_buttons.append(' &nbsp; ');    
    window_buttons.append(new dbd.objects.Button('Créer une nouvelle connexion', function()
    {
        var name = $('#dbd_form_new_connexion_name').val();
        var database = $('#dbd_form_new_connexion_db').val();
        var host = $('#dbd_form_new_connexion_server').val();
        var login = $('#dbd_form_new_connexion_login').val();
        var password = $('#dbd_form_new_connexion_password').val();
        var port = $('#dbd_form_new_connexion_port').val();
        
        var connexion = new dbd.objects.Connexion(0, name, database, host, login, password, port);
        connexion.save();
    }, null, 'add-connexion'));
    
    window_new_connexion.append(window_buttons);
    
    window_new_connexion.display();
    
    $('#dbd_form_new_connexion_server').focus();
}

var window_import_table;
dbd.objects.Connexion.import_table = function()
{
    window_import_table = new dbd.objects.Window(800, 450, 'Importer une table');
    
    var form = $('<form class="dbd_form" id="form_import_table"></form>');
    var select_connexions = new dbd.objects.Form.select('dbd_form_import_table_connexions', 'Choisissez la connexion', dbd.connexions, '', true);
    form.append(select_connexions);
    select_connexions.on('change', dbd.objects.Connexion.getDatabases);
    
    window_import_table.append(form);
    window_import_table.display();
}

dbd.objects.Connexion.getDatabases = function()
{
    if($('#dbd_form_import_table_databases').length > 0)
    {
        $('#dbd_form_import_table_databases').parent().remove();
    }
    if($('#dbd_form_import_table_tables').length > 0)
    {
        $('#dbd_form_import_table_tables').parent().remove();
    }

    var connexion_selected = $('#dbd_form_import_table_connexions').val();
    
    if(connexion_selected)
    {
        $.ajax('ajax/connexion.php', 
        {
            dataType: 'json',
            data: 'action=getDataBases&connexion='+connexion_selected,
            method: 'POST'
        }).done(function(ret, textStatus, jqXHR){
            if(ret.databases)
            {
                var databases = new Array();
                for(var i = 0; i < ret.databases.length; i++)
                {
                    databases.push({ id: ret.databases[i], name: ret.databases[i] });
                }
                
                var select_databases = new dbd.objects.Form.select('dbd_form_import_table_databases', 'Choisissez la base de données', databases, '', true);
                $('#form_import_table').append(select_databases);
                select_databases.on('change', dbd.objects.Connexion.getTables);
            }
            if(ret.notification)
            {
                var notification = new dbd.objects.Notification(ret.notification.icon, ret.notification.text, ret.notification.delay);
                notification.display();
            }
        });
    }
}

dbd.objects.Connexion.getTables = function()
{
    if($('#dbd_form_import_table_tables').length > 0)
    {
        $('#dbd_form_import_table_tables').parent().parent().remove();
    }   
    $('#window_form_import_table_buttons').remove();

    var connexion_selected = $('#dbd_form_import_table_connexions').val();
    var database_selected = $('#dbd_form_import_table_databases').val();
    
    if(connexion_selected && database_selected)
    {
        $.ajax('ajax/connexion.php', 
        {
            dataType: 'json',
            data: 'action=getTables&connexion='+connexion_selected+'&database='+database_selected,
            method: 'POST'
        }).done(function(ret, textStatus, jqXHR){
            if(ret.tables)
            {
                var tables = new Array();
                for(var i = 0; i < ret.tables.length; i++)
                {
                    tables.push({ id: ret.tables[i], name: ret.tables[i] });
                }
                
                var select_tables = new dbd.objects.Form.chooseMultipleElements('dbd_form_import_table_tables', 'Choisissez les tables à importer', tables, 10);
                $('#form_import_table').append(select_tables);

				var window_buttons = $('<div></div>');
				window_buttons.addClass("window_buttons");
				window_buttons.attr('id', 'window_form_import_table_buttons');
				window_buttons.append(new dbd.objects.Button('Importer les tables', dbd.objects.Connexion.importTables, null, 'test-connexion')); 
				
				$('#form_import_table').append(window_buttons);
            }
            if(ret.notification)
            {
                var notification = new dbd.objects.Notification(ret.notification.icon, ret.notification.text, ret.notification.delay);
                notification.display();
            }
        });
    }
}

dbd.objects.Connexion.importTables = function(e)
{
    e.preventDefault();
    
    var connexion_selected = $('#dbd_form_import_table_connexions').val();
    var database_selected = $('#dbd_form_import_table_databases').val();
    var tables_selected = '';
	
	$('#dbd_form_import_table_tables_selected').children().each(function()
	{
		tables_selected += $(this).text()+",";
	});
    
    if(connexion_selected && database_selected && tables_selected)
    {
        $.ajax('ajax/connexion.php', 
        {
            dataType: 'json',
            data: 'action=getColumns&connexion='+connexion_selected+'&database='+database_selected+'&tables='+tables_selected,
            method: 'POST'
        }).done(function(ret, textStatus, jqXHR){
            
			console.log(ret);
			
			for( var table_name in ret.columns)
            {
				var table = new dbd.objects.Table();
				table.name = table_name;
				
				for(var i = 0; i < ret.columns[table_name].length; i++)
				{
					var regex = /(.*)\((.*)\).*/;
					var match = regex.exec(ret.columns[table_name][i].Type);
					
					var colonneType;
					if(match)
					{
						colonneType = match[1];
						colonneSize = match[2];
					}
					else
					{
						colonneType = ret.columns[table_name][i].Type;
						colonneSize = '';
					}
					colonneType = colonneType.replace(' unsigned', '');

					var colonneTypeId = null;
					for( var t in statics.schemas_types[dbd.schema.type].columns_type)
					{
						var type = statics.schemas_types[dbd.schema.type].columns_type[t].column_type_name;
						if(type.toLowerCase() == colonneType.toLowerCase())
						{
							colonneTypeId = t;
						}
					}
					
					if(colonneTypeId == null)
					{
						var notification = new dbd.objects.Notification('ko', 'Impossible d\'importer la table, le type de colonne '+colonneType+' n\'a pas été reconnu');
						notification.display();
						return;
					}

					var column = new dbd.objects.Column();
					column.name = ret.columns[table_name][i].Field;
					column.type = colonneTypeId;
					column.size = colonneSize;
					column.primary_key = (ret.columns[table_name][i].Key == 'PRI');
					column.default_value = ret.columns[table_name][i].Default;
					column.allow_null = (ret.columns[table_name][i].Null == 'YES');
					column.table = table;
					
					table.addChild(column);
				}
				
				dbd.schema.tables.addChild(table);
				table.draw();
			}
			
            window_import_table.close();
            
            dbd.schema.autosave();
        });
    }
}

dbd.objects.Connexion.prototype.test = function()
{
    $.ajax('ajax/connexion.php', 
    {
        dataType: 'json',
        data: 'action=test&database='+this.database+'&host='+this.host+'&login='+this.login+'&password='+this.password+'&port='+this.port,
        method: 'POST'
    }).done(function(ret, textStatus, jqXHR){
        if(ret.notification)
        {
            var notification = new dbd.objects.Notification(ret.notification.icon, ret.notification.text, ret.notification.delay);
            notification.display();
        }
    });
}

dbd.objects.Connexion.prototype.save = function()
{
	var current_connexion = this;
	
    $.ajax('ajax/connexion.php', 
    {
        dataType: 'json',
        data: 'action=save&name='+this.name+'&database='+this.database+'&host='+this.host+'&login='+this.login+'&password='+this.password+'&port='+this.port,
        method: 'POST'
    }).done(function(ret, textStatus, jqXHR){
        if(ret.notification)
        {
            var notification = new dbd.objects.Notification(ret.notification.icon, ret.notification.text, ret.notification.delay);
            notification.display();
        }
        window_new_connexion.close();
        
        dbd.connexions.push(current_connexion);
    });
}


