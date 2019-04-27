<?php

include '../includes/top.inc.php';

$return = array();

try
{
    Db::get()->sql_query("INSERT INTO ".Db::tn('schemas')." (name, type, last_update)
    VALUES ('".DB::pr($_GET['name'])."', ".(int)$_GET['type'].", NOW())");

    $return['data'] = array('id' => Db::get()->insert_id());
}
catch(Exception $e)
{
    $return['error'] = array('message' => 'Impossible de créer un nouveau schéma : '.$e->getMessage());
}
echo json_encode($return);

?>