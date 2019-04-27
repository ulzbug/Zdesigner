<?php

include '../includes/top.inc.php';

$return = array();

if($_POST['action'] == 'create')
{
	try
	{
		Db::get()->sql_query("INSERT INTO ".DB::tn('directories')." (name, parent_id)
		VALUES ('".DB::pr($_POST['name'])."', ".(int)$_POST['parent_id'].")");

		$return['data'] = array('id' => Db::get()->insert_id());
		
		$return['notification'] = array('icon' => 'ok', 'text' => 'Le dossier a bien été créé');
	}
	catch(Exception $e)
	{
		$return['error'] = array('message' => 'Impossible de créer ce dossier : '.$e->getMessage());
	}
}

echo json_encode($return);

?>