<?php

include '../includes/top.inc.php';

$return = array();

try
{
    $str_json = file_get_contents('php://input');
    $schema = json_decode($str_json);
    
    Db::get()->start_transaction();
    
    if($schema->id > 0)
    {
        Db::get()->sql_query("UPDATE ".Db::tn('schemas')." SET 
		name = '".Db::pr($schema->name)."', 
		type = '".Db::pr($schema->type)."', 
		read_only = '".(int)$schema->read_only."', 
		size = '".Db::pr($schema->size)."', 
		last_update = NOW() 
		WHERE id = ".(int)$schema->id);
    }
    
    $tables = array();
    $result = Db::get()->sql_query("SELECT * FROM ".Db::tn('tables')." WHERE schema_id = ".(int)$schema->id);
    while($row = $result->fetch_assoc())
    {
        $tables[$row['id']] = $row;
    }    
    
    $columns = array();
    $result = Db::get()->sql_query("SELECT c.* FROM ".Db::tn('tables')." t 
    JOIN ".Db::tn('columns')." c ON c.table_id = t.id
    WHERE t.schema_id = ".(int)$schema->id);
    while($row = $result->fetch_assoc())
    {
        $columns[$row['id']] = $row;
    }
    
    foreach($schema->tables->children AS $table)
    {
        if(substr($table->id, 0, 10) == 'table-new-')
        {
            Db::get()->sql_query("INSERT INTO ".Db::tn('tables')." (schema_id, name, pos_x, pos_y)
            VALUES (".(int)$schema->id.", '".Db::pr($table->name)."', '".(int)$table->position->x."', '".(int)$table->position->y."')");
            $table_id = Db::get()->insert_id();
            
            $return['updates'][] = array('type' => 'table', 'id' => $table->id, 'fields' => array('id' => 'table-'.$table_id));
        }
        else
        {
            $table_id = (int)str_replace('table-', '', $table->id);
            Db::get()->sql_query("UPDATE ".Db::tn('tables')." SET name = '".Db::pr($table->name)."', pos_x = '".(int)$table->position->x."', pos_y = '".(int)$table->position->y."', comment = '".Db::pr($table->comment)."'
            WHERE id = ".(int)$table_id);
            unset($tables[$table_id]);
        }
        
        $order_by = 0;
        foreach($table->children AS $column)
        {
            $order_by ++;
            
            $foreign_key = (int)str_replace('column-', '', $column->foreign_key);
            if(substr($column->id, 0, 11) == 'column-new-')
            {
                Db::get()->sql_query("INSERT INTO ".Db::tn('columns')." (table_id, name, type, size, primary_key, default_value, allow_null, auto_increment, attributes, foreign_key, order_by, comment)
                VALUES (".(int)$table_id.", '".Db::pr($column->name)."', '".(int)$column->type."', '".Db::pr($column->size)."', '".(int)$column->primary_key."', '".Db::pr($column->default_value)."', 
                '".(int)$column->allow_null."', '".(int)$column->auto_increment."', '".Db::pr($column->attributes)."', '".(int)$foreign_key."', ".(int)$order_by.", '".Db::pr($column->comment)."')");
                $column_id = Db::get()->insert_id();
                
                $return['updates'][] = array('type' => 'column', 'id' => $column->id, 'fields' => array('id' => 'column-'.$column_id));
            }
            else
            {
                $column_id = (int)str_replace('column-', '', $column->id);
                
                Db::get()->sql_query("UPDATE ".Db::tn('columns')." 
                SET name = '".Db::pr($column->name)."',
                type = '".(int)$column->type."',
                size = '".Db::pr($column->size)."',
                primary_key = '".(int)$column->primary_key."',
                default_value = '".Db::pr($column->default_value)."',
                allow_null = '".(int)$column->allow_null."',
                auto_increment = '".(int)$column->auto_increment."',
                attributes = '".Db::pr($column->attributes)."',
                foreign_key = '".(int)$foreign_key."',
                order_by = '".(int)$order_by ."', 
                comment = '".Db::pr($column->comment)."'
                WHERE id = ".(int)$column_id);
                unset($columns[$column_id]);
            }
        }
    }

    foreach($columns AS $column_id => $column)
    {
        Db::get()->sql_query("UPDATE ".Db::tn('columns')." SET foreign_key = 0 WHERE foreign_key = ".(int)$column_id);
        
        Db::get()->sql_query("DELETE FROM ".Db::tn('columns')." WHERE id = ".(int)$column_id);
    }    
    foreach($tables AS $table_id => $table)
    {
        Db::get()->sql_query("DELETE FROM ".Db::tn('tables')." WHERE id = ".(int)$table_id);
    }
    
    Db::get()->commit_transaction();
    
    $return['notification'] = array('icon' => 'ok', 'text' => 'Le schéma a bien été sauvegardé', 'delay' => 3000);
}
catch(Exception $e)
{
    $return['notification'] = array('icon' => 'ko', 'text' => 'Impossible d\'enregistrer le schéma : '.utf8_encode($e->getMessage()), 'delay' => 15000);
}
echo json_encode($return);

?>