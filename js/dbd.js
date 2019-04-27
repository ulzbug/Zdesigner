
var dbd = {
    objects:{},
    
    config: {
        autosave : false,
        alignOnGrid:true,
    },
    
    init : function()
    {
        $(function()
        {
			for(var i = 0; i < schemas.length; i++)
			{
				if(!directories[schemas[i].directory_id])
				{
					directories[schemas[i].directory_id] = {};
				}
				
				if(!directories[schemas[i].directory_id].children)
				{
					directories[schemas[i].directory_id].children = new Array();
				}
				
				directories[schemas[i].directory_id].children.push({ type : 'schema', id : schemas[i].id, name : schemas[i].name});
			}
			
			directories[0].id = 0;
			
            dbd.Menu.init();
            
            dbd.connexions = new Array();
            for(var i = 0; i < connexions.length; i++)
            {
                dbd.connexions.push(new dbd.objects.Connexion(connexions[i].id, connexions[i].name, connexions[i].database, connexions[i].host, connexions[i].login, connexions[i].password, connexions[i].port));
            }
            
            dbd.schema = new dbd.objects.Schema();
            
            if(load_schema.id > 0)
            {
                dbd.schema.load(load_schema);
            }
            
            dbd.schema.draw();
            
            dbd.schema.update_size();
        });
    },
    
    draw : function()
    {
        dbd.schema.draw();
    }
}