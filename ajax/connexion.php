<?php

include '../includes/top.inc.php';

$return = array();

if($_POST['action'] == 'test')
{
    try
    {
        switch($_POST['database'])
        {
            case 'mysql':
                $port = 3306;
                if($_POST['port'])
                {
                    $port = (int)$_POST['port'];
                }
                $db = new PDO('mysql:host='.$_POST['host'].';port='.$port.';charset=utf8', $_POST['login'], $_POST['password']);
                break;
            default:
                throw new Exception('Le type de base de données est inconnu');
                break;
        }
        
        $return['notification'] = array('icon' => 'ok', 'text' => 'La connexion à la base de données a bien fonctionné');
    }
    catch(Exception $e)
    {
        $return['notification'] = array('icon' => 'ko', 'text' => 'Impossible de se connecter à la base de données : '.utf8_encode($e->getMessage()), 'delay' => 15000);
    }
}
elseif($_POST['action'] == 'save')
{
    try
    {
        switch($_POST['database'])
        {
            case 'mysql':
                $port = 3306;
                if($_POST['port'])
                {
                    $port = (int)$_POST['port'];
                }
                break;
            default:
                throw new Exception('Le type de base de données est inconnu');
                break;
        }
        
        
        
        Db::get()->sql_query("INSERT INTO ".Db::tn('connexions')." (name, `database`, host, login, password, port)
        VALUES ('".Db::pr($_POST['name'])."', '".Db::pr($_POST['database'])."', '".Db::pr($_POST['host'])."', '".Db::pr($_POST['login'])."', '".Db::pr($_POST['password'])."', '".(int)$port."')");
        
        $return['notification'] = array('icon' => 'ok', 'text' => 'La connexion a bien été enregistrée. Vous pouvez maintenant importer des tables depuis cette connexion.');
    }
    catch(Exception $e)
    {
        $return['notification'] = array('icon' => 'ko', 'text' => 'Impossible de créer cette connexion : '.utf8_encode($e->getMessage()), 'delay' => 15000);
    }
}
elseif($_POST['action'] == 'getDataBases' && $_POST['connexion'])
{
    try
    {
        $result = Db::get()->sql_query("SELECT `database`, host, login, password, port FROM connexions WHERE id = ".(int)$_POST['connexion']);
        $connexion = $result->fetch_assoc();
        
        $databases = array();
        switch($connexion['database'])
        {
            case 'mysql';
                $db = new PDO('mysql:host='.$connexion['host'].';port='.$connexion['port'].';charset=utf8', $connexion['login'], $connexion['password']);
                $result = $db->query("SHOW DATABASES");
                while($row = $result->fetch(PDO::FETCH_ASSOC))
                {
                    $databases[] = $row['Database'];
                }
                break;
        }
        
        $return['databases'] = $databases;
    }
    catch(Exception $e)
    {
        $return['notification'] = array('icon' => 'ko', 'text' => 'Erreur : '.utf8_encode($e->getMessage()), 'delay' => 15000);
    }
}
elseif($_POST['action'] == 'getTables' && $_POST['connexion'] && $_POST['database'])
{
    try
    {
        $result = Db::get()->sql_query("SELECT `database`, host, login, password, port FROM connexions WHERE id = ".(int)$_POST['connexion']);
        $connexion = $result->fetch_assoc();
        
        $tables = array();
        switch($connexion['database'])
        {
            case 'mysql';
                $db = new PDO('mysql:host='.$connexion['host'].';dbname='.$_POST['database'].';port='.$connexion['port'].';charset=utf8', $connexion['login'], $connexion['password']);
                $result = $db->query("SHOW TABLES");
                while($row = $result->fetch(PDO::FETCH_NUM))
                {
                    $tables[] = $row[0];
                }
                break;
        }
        
        $return['tables'] = $tables;
    }
    catch(Exception $e)
    {
        $return['notification'] = array('icon' => 'ko', 'text' => 'Erreur : '.utf8_encode($e->getMessage()), 'delay' => 15000);
    }
}
elseif($_POST['action'] == 'getColumns' && $_POST['connexion'] && $_POST['database'] && $_POST['tables'])
{
    try
    {
        $result = Db::get()->sql_query("SELECT `database`, host, login, password, port FROM connexions WHERE id = ".(int)$_POST['connexion']);
        $connexion = $result->fetch_assoc();
        
		$tables = explode(',', $_POST['tables']);
		
        $columns = array();
        switch($connexion['database'])
        {
            case 'mysql';
                $db = new PDO('mysql:host='.$connexion['host'].';dbname='.$_POST['database'].';port='.$connexion['port'].';charset=utf8', $connexion['login'], $connexion['password']);
				
				// var_dump($db);
				
				foreach($tables AS $table)
				{
					if($table)
					{
						$result = $db->query("SHOW COLUMNS FROM `".$table."` FROM `".$_POST['database']."`");
						while($row = $result->fetch(PDO::FETCH_ASSOC))
						{
							$columns[$table][] = $row;
						}
					}
				}
                break;
        }
        
        $return['columns'] = $columns;
    }
    catch(Exception $e)
    {
        $return['notification'] = array('icon' => 'ko', 'text' => 'Erreur : '.utf8_encode($e->getMessage()), 'delay' => 15000);
    }
}

echo json_encode($return);

?>