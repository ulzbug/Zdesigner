<?php

function get_schemas()
{
    $return = array();
    $result = Db::get()->sql_query("SELECT id, name, directory_id FROM ".Db::tn('schemas'));
    while($schema = $result->fetch_assoc())
    {
        $return[] = $schema;
    }
   
    return $return;
}

function get_schema($schema_id)
{
    $result = Db::get()->sql_query("SELECT id, name, type, read_only, size FROM ".Db::tn('schemas')." WHERE id = ".(int)$schema_id);
    $return = $result->fetch_assoc();
    
    $return['tables'] = array();
    $result = Db::get()->sql_query("SELECT id, name, pos_x, pos_y, comment FROM ".Db::tn('tables')." WHERE schema_id = ".(int)$schema_id);
    while($row = $result->fetch_assoc())
    {
        $return['tables']['table-'.$row['id']] = $row;
    }    
    
    $result = Db::get()->sql_query("SELECT t.id AS table_id, c.id, c.name, c.type, ct.name AS type_name, c.size, c.primary_key, c.default_value, c.allow_null, c.auto_increment, c.attributes, c.foreign_key, c.comment
    FROM ".Db::tn('tables')." t
    JOIN ".Db::tn('columns')." c ON c.table_id = t.id
    JOIN ".Db::tn('columns_types')." ct ON ct.id = c.type
    WHERE t.schema_id = ".(int)$schema_id."
    ORDER BY order_by");
    while($row = $result->fetch_assoc())
    {
        $return['tables']['table-'.$row['table_id']]['columns']['column-'.$row['id']] = $row;
    }
    
    return $return;
}

function get_static_datas()
{
    $return = array();
    
    $result = Db::get()->sql_query("SELECT st.id AS schema_type_id, st.name AS schema_type_name, cg.id AS group_id, cg.name AS group_name, ct.id AS column_type_id, ct.name AS column_type_name, ct.top
    FROM ".Db::tn('schemas_types')." st
    JOIN ".Db::tn('columns_types')." ct ON ct.schema_type = st.id
    JOIN ".Db::tn('columns_group')." cg ON cg.id = ct.group");
    while($row = $result->fetch_assoc())
    {
        $return['schemas_types'][$row['schema_type_id']]['schema_name'] = $row['schema_type_name'];
        if($row['top'])
        {
            $return['schemas_types'][$row['schema_type_id']]['columns_top'][] = $row['column_type_id'];
        }
        $return['schemas_types'][$row['schema_type_id']]['columns_group'][$row['group_id']]['group_name'] = $row['group_name'];
        $return['schemas_types'][$row['schema_type_id']]['columns_group'][$row['group_id']]['columns_types'][] = $row['column_type_id'];
        $return['schemas_types'][$row['schema_type_id']]['columns_type'][$row['column_type_id']]['column_type_name'] = $row['column_type_name'];
    }
    
    return $return;
}

function get_connexions()
{
    $return = array();
    $result = Db::get()->sql_query("SELECT id, name, `database`, host, login, password, port FROM ".Db::tn('connexions'));
    while($connexion = $result->fetch_assoc())
    {
        $return[] = $connexion;
    }
   
    return $return;
}
function get_directories()
{
    $return = array();
    $result = Db::get()->sql_query("SELECT id, name, parent_id FROM ".Db::tn('directories'));
    while($directory = $result->fetch_assoc())
    {
        $return[$directory['id']]['id'] = $directory['id'];
        $return[$directory['id']]['name'] = $directory['name'];
        $return[$directory['parent_id']]['children'][] = array('type' => 'directory' , 'id' => $directory['id']);
    }
   
    return $return;
}

?>
