

dbd.Menu = {

    displayed : false,

    init : function()
    {
		console.log('init_html');
		this.init_html();
		
		console.log('init_events');
		this.init_events();
        
        this.keyboard_shortcut();
    },
	
	init_html : function()
	{
		$('nav').html('');
		
		console.log('init_html');
		
		var menu = $('<ul></ul>').attr('id', 'menu');
		menu.append($('<li></li>').attr('id', 'menu_fichier').html('<span>Fichier</span>'));
		menu.append($('<li></li>').attr('id', 'menu_export').html('<span>Export</span>'));
		menu.append($('<li></li>').attr('id', 'menu_connexions').html('<span>Connexions</span>'));
		if(schemas.length > 0)
		{
			menu.append($('<li></li>').attr('id', 'menu_schema').html('<span>Schemas</span>'));
		}
		$('nav').append(menu);
		
		var sub_menu_file = {
			id : 'fichier',
			children : new Array(
				{ name : 'Nouveau schéma', id : 'new', shortcut : 'Ctrl + N'},
				{ name : 'Nouvelle Table', id : 'new-table', shortcut : 'Alt + T'},
				{ name : 'Importer une table', id : 'import-table', shortcut : 'Alt + I'},
				{ name : 'Enregistrer', id : 'save', shortcut : 'Ctrl + S'},
				{ name : 'Enregistrer sous', id : 'save_as'},
				{ name : 'Paramètres du schéma', id : 'settings'}
			)
		};
		
		var sub_menu_export = {
			id : 'export',
			children : new Array(
				{ name : 'SQL ...', id : 'sql'},
				{ name : 'Image ...', id : 'image'}
			)
		};
		
		var sub_menu_connexions = {
			id : 'connexions',
			children :  new Array(
				{ name : 'Nouvelle connexion', id : 'new', shortcut : 'Alt + C'}
			)
		};
		
		console.log('init_sub_menu');
		
		this.init_sub_menu(sub_menu_file);
		this.init_sub_menu(sub_menu_export);
		this.init_sub_menu(sub_menu_connexions);
		
		console.log('init schema');
		
		$('#menu_schema').append( this.init_schema_sub_menu(directories[0], 'sous_menu_schema') );
		
		console.log('fin');
	},
	
	init_sub_menu : function(sub_menu)
	{
		var sub_menu_html = $('<ul></ul>').attr('class', 'sous-menu').attr('id', 'sous_menu_'+sub_menu.id);
		for(var i = 0; i < sub_menu.children.length; i++)
		{
			var elt = sub_menu.children[i];
			
			var option = $('<li></li>').attr('id', 'menu-'+sub_menu.id+'-'+elt.id).html('<span>'+elt.name+'</span>')
			if(elt.shortcut)
			{
				option.append($('<span class="menu_shortcut">'+elt.shortcut+'</span>'));
			}
			sub_menu_html.append(option);
		}
		
		$('#menu_'+sub_menu.id).append(sub_menu_html);
	},
	
	init_schema_menu : function()
	{

		
		
	},
	
	init_schema_sub_menu : function(directory, id)
	{
		var sub_menu_html = $('<ul></ul>').attr('class', 'sous-menu').attr('id', id);
		
		if(directory.children && directory.children.length > 0)
		{
			for(var i = 0; i < directory.children.length; i++)
			{
				var child = directory.children[i];
				if(child.type == 'schema')
				{
					sub_menu_html.append($('<li></li>').attr('id', 'menu-schema-'+child.id).html(child.name));
				}
				else if(child.type == 'directory')
				{
					var option = $('<li></li>').attr('id', 'menu-directory-'+child.id).html('<span>'+directories[child.id].name+'</span>').addClass('menu-directory');
					option.append($('<span class="menu_shortcut"> > </span>'));
					
					option.append( this.init_schema_sub_menu(directories[child.id], 'menu-directory-'+child.id+'-options') );
					
					sub_menu_html.append(option);
				}
			}
			
			var option = $('<li></li>').attr('id', 'menu-new-directory-'+directory.id).html('<span>Nouveau dossier ...</span>');
			
			sub_menu_html.append(option);
		}
		
		return sub_menu_html;
	},
    
    action : function (action)
    {
        switch(action)
        {
            case 'menu-fichier-new-table':
                if(!dbd.schema.read_only)
                {
                    dbd.schema.addNewTable();
                    dbd.draw();
                }
                break;
            case 'menu-fichier-new':
                dbd.schema.new_schema();
                break;
            case 'menu-fichier-save':
                dbd.schema.save();
                break;
            case 'menu-fichier-save_as':
                dbd.schema.saveas();
                break;
            case 'menu-fichier-import-table':
                if(!dbd.schema.read_only)
                {
                    dbd.objects.Connexion.import_table();
                }
                break;
			case 'menu-fichier-settings':
				dbd.schema.display_settings();
				break;
            case 'menu-connexions-new':
                dbd.objects.Connexion.display_form_new_connexion();
                break;
            case 'menu-export-sql':
                dbd.schema.display_export_sql();
                break;
        }
        
		console.log(action);
		
        if(action.substring(0, 12) == 'menu-schema-')
        {
            document.location = 'schema-'+action.replace('menu-schema-', '');
        }
		else if(action.substring(0, 19) == 'menu-new-directory-')
        {
            this.window_create_new_directory(action.replace('menu-new-directory-', ''));
        }
    },
	
	init_events : function()
	{
        $("#menu>li").click(function(e){
			if($('#menu_fichier').hasClass('clicked'))
			{
				$("#menu>li").removeClass('clicked');
			}
			else
			{
				$("#menu>li").addClass('clicked');
			}
            
            return false;
        });
        
        $("#menu>li").mouseover(function(e){
			var sousmenu = $('#sous_'+$(this).attr('id'));

			sousmenu.css("left", $(this).position().left);
			sousmenu.css("top", $(this).position().top + $(this).innerHeight());
            
            return false;
        });
        
        $(".sous-menu li").click(function(e){
            dbd.Menu.action($(this).attr('id'));
			$("#menu>li").removeClass('clicked');
            
            return false;
        });
        
        $(".sous-menu li.menu-directory").mouseover(function(e){

            var id = $(this).attr('id');
			
			$('#' + id + '-options').css("left", $(this).innerWidth() - 3);
			$('#' + id + '-options').css("top", '0px');
			$('#' + id + '-options').zIndex(parseInt($(this).zIndex()) + 10);
			
            return false;
        });
	},
    
    keyboard_shortcut: function()
    {
        $(window).bind('keydown', function(event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        dbd.schema.save();
                        break;
                    case 'f':
                        //event.preventDefault();
                        //alert('ctrl-f');
                        break;
                    case 'g':
                        //event.preventDefault();
                        //alert('ctrl-g');
                        break;
                }
            }
            else if (event.altKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 't':
                        event.preventDefault();
                        dbd.schema.addNewTable();
                        dbd.draw();
                        break;                    
                    case 'c':
                        event.preventDefault();
                        dbd.objects.Connexion.display_form_new_connexion();
                        break;                    
                    case 'i':
                        event.preventDefault();
                        dbd.objects.Connexion.import_table();
                        break;
                }
            }
        });
    }, 
	
	window_create_new_directory: function(parent_directory_id)
	{
		var window_new_dir = new dbd.objects.Window(400, 200, 'Create a new directory');
		var form = $('<form class="dbd_form"></form>');
		form.append(new dbd.objects.Form.inputText('dbd_form_new_directory_name', 'Nom du nouveau dossier', ''));

		window_new_dir.append(form);
		
		var window_buttons = $('<div></div>');
		window_buttons.addClass("window_buttons");

		window_buttons.append(new dbd.objects.Button('Valider', function()
		{
			$.ajax('ajax/directory.php', 
			{
				dataType: 'json',
				data: 'action=create&name='+$('#dbd_form_new_directory_name').val()+'&parent_id='+parent_directory_id,
				method: 'POST'
			}).done(function(ret, textStatus, jqXHR)
			{
				if(ret.data && ret.data.id)
				{
					if(!directories[parent_directory_id].children)
					{
						directories[parent_directory_id].children = new Array();
					}
					
					var new_id = ret.data.id;
					var new_name = $('#dbd_form_new_directory_name').val();
					
					directories[parent_directory_id].children.push({ type : 'directory', id : new_id, name : new_name});
					directories[new_id]= {
						id : new_id,
						name : new_name
					};
					
					console.log(directories);
					console.log(this);
					
					dbd.Menu.init();
				}
				
				if(ret.notification)
				{
					var notification = new dbd.objects.Notification(ret.notification.icon, ret.notification.text, ret.notification.delay);
					notification.display();
				}
				
				window_new_dir.close();
			});
		}, this, 'save'));
		
		window_buttons.append(' &nbsp; ');
		window_buttons.append(new dbd.objects.Button('Annuler', function()
		{
			window_new_dir.close(); 
		}, this, 'cancel'));
		
		window_new_dir.append(window_buttons);
		
		window_new_dir.display();
	}
}
